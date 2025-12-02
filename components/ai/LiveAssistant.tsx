import { GoogleGenAI, LiveServerMessage, Modality, Blob } from "@google/genai";
import React, { useState, useRef, useEffect } from 'react';
import { decode, decodeAudioData, encode } from '../../services/geminiService';
import { MicrophoneIcon, StopIcon } from '../Icons';

type ConnectionState = 'IDLE' | 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'ERROR';

const LiveAssistant = () => {
    const [connectionState, setConnectionState] = useState<ConnectionState>('IDLE');
    const [inputTranscription, setInputTranscription] = useState('');
    const [outputTranscription, setOutputTranscription] = useState('');

    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);

    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const nextStartTimeRef = useRef(0);
    const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

    // Visualizer refs
    const analyserRef = useRef<AnalyserNode | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number | null>(null);

    const stopConversation = () => {
        if (sessionPromiseRef.current) {
            sessionPromiseRef.current.then(session => session.close());
            sessionPromiseRef.current = null;
        }

        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }

        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current = null;
        }
        if (mediaStreamSourceRef.current) {
            mediaStreamSourceRef.current.disconnect();
            mediaStreamSourceRef.current = null;
        }

        if (analyserRef.current) {
            analyserRef.current.disconnect();
            analyserRef.current = null;
        }

        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }

        // Stop any currently playing/queued audio from the AI
        for (const source of audioSourcesRef.current.values()) {
            source.stop();
        }
        audioSourcesRef.current.clear();
        nextStartTimeRef.current = 0;

        if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
            outputAudioContextRef.current.close();
            outputAudioContextRef.current = null;
        }

        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }

        setConnectionState('IDLE');
    };

    const drawVisualizer = () => {
        if (!analyserRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            if (!analyserRef.current) return;

            animationFrameRef.current = requestAnimationFrame(draw);
            analyserRef.current.getByteFrequencyData(dataArray);

            ctx.fillStyle = 'rgb(20, 20, 20)'; // Match card background roughly
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 2;

                const r = barHeight + 25 * (i / bufferLength);
                const g = 250 * (i / bufferLength);
                const b = 50;

                ctx.fillStyle = `rgb(${r},${g},${b})`;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }
        };

        draw();
    };

    const startConversation = async () => {
        setConnectionState('CONNECTING');
        setInputTranscription('');
        setOutputTranscription('');

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            // Cast window to any to support webkitAudioContext for older browsers without TS errors.
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            nextStartTimeRef.current = 0;
            audioSourcesRef.current.clear(); // Clear any stale sources

            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        setConnectionState('CONNECTED');
                        // Cast window to any to support webkitAudioContext for older browsers without TS errors.
                        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });

                        const source = audioContextRef.current.createMediaStreamSource(stream);
                        mediaStreamSourceRef.current = source;

                        // Setup Analyser
                        const analyser = audioContextRef.current.createAnalyser();
                        analyser.fftSize = 256;
                        source.connect(analyser);
                        analyserRef.current = analyser;
                        drawVisualizer();

                        const scriptProcessor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = scriptProcessor;

                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob: Blob = {
                                // Pass the ArrayBuffer from the Int16Array directly to encode.
                                data: encode(new Int16Array(inputData.map(x => x * 32768)).buffer),
                                mimeType: 'audio/pcm;rate=16000',
                            };
                            sessionPromiseRef.current?.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        // Connect through analyser to script processor if needed, or parallel
                        // Source -> Analyser
                        // Source -> ScriptProcessor -> Destination
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(audioContextRef.current.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        // Handle transcription
                        if (message.serverContent?.outputTranscription) {
                            setOutputTranscription(prev => prev + message.serverContent.outputTranscription.text);
                        }
                        if (message.serverContent?.inputTranscription) {
                            setInputTranscription(prev => prev + message.serverContent.inputTranscription.text);
                        }
                        if (message.serverContent?.turnComplete) {
                            setInputTranscription('');
                            setOutputTranscription('');
                        }

                        // Handle audio output
                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
                        if (base64Audio && outputAudioContextRef.current) {
                            const audioCtx = outputAudioContextRef.current;
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioCtx.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), audioCtx, 24000, 1);
                            const source = audioCtx.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(audioCtx.destination);
                            source.addEventListener('ended', () => {
                                audioSourcesRef.current.delete(source);
                            });
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                            audioSourcesRef.current.add(source);
                        }

                        // Handle interruption from the user.
                        if (message.serverContent?.interrupted) {
                            for (const source of audioSourcesRef.current.values()) {
                                source.stop();
                            }
                            audioSourcesRef.current.clear();
                            nextStartTimeRef.current = 0;
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Live API Error:', e);
                        setConnectionState('ERROR');
                        stopConversation();
                    },
                    onclose: () => {
                        setConnectionState('DISCONNECTED');
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    outputAudioTranscription: {},
                    inputAudioTranscription: {},
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                },
            });
        } catch (error) {
            console.error('Failed to start conversation:', error);
            setConnectionState('ERROR');
        }
    };

    useEffect(() => {
        // Cleanup on component unmount
        return () => {
            stopConversation();
        };
    }, []);

    const isConversing = connectionState === 'CONNECTED' || connectionState === 'CONNECTING';

    const getStatusTextAndColor = () => {
        switch (connectionState) {
            case 'IDLE': return { text: 'Click the mic to start your vocal session.', color: 'text-muted-foreground' };
            case 'CONNECTING': return { text: 'Connecting to coach...', color: 'text-yellow-400' };
            case 'CONNECTED': return { text: 'Listening...', color: 'text-green-400' };
            case 'DISCONNECTED': return { text: 'Session ended. Click to start again.', color: 'text-muted-foreground' };
            case 'ERROR': return { text: 'An error occurred. Please try again.', color: 'text-red-500' };
        }
    };

    const { text: statusText, color: statusColor } = getStatusTextAndColor();

    return (
        <div className="space-y-6 text-center">
            <div>
                <h3 className="text-xl font-bold text-foreground">AI Vocal Coach</h3>
                <p className="text-muted-foreground">Speak with an AI vocal coach in real-time. Practice scales, ask theory questions, or get feedback.</p>
            </div>

            {/* Visualizer Canvas */}
            <div className="flex justify-center">
                <canvas
                    ref={canvasRef}
                    width="300"
                    height="100"
                    className="rounded-lg bg-card border border-border shadow-inner"
                />
            </div>

            <div className="flex justify-center items-center my-6">
                <button
                    onClick={isConversing ? stopConversation : startConversation}
                    className={`rounded-full p-6 transition-all duration-300 ${isConversing ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-secondary-foreground hover:bg-secondary-foreground/80'}`}
                >
                    {isConversing ? <StopIcon className="h-10 w-10 text-white" /> : <MicrophoneIcon className="h-10 w-10 text-secondary" />}
                </button>
            </div>
            <p className={`font-semibold ${statusColor}`}>{statusText}</p>

            <div className="text-left bg-accent/50 p-4 rounded-lg min-h-[120px] border border-border">
                <p><strong className="text-secondary">You:</strong> {inputTranscription}</p>
                <p><strong className="text-foreground">Coach:</strong> {outputTranscription}</p>
            </div>
        </div>
    );
};

export default LiveAssistant;