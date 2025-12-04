import React from 'react';
import { Pricing } from '../Pricing';
import { PageTransition } from '../PageTransition';
import { ErrorBoundary } from '../ErrorBoundary';

export const PricingPage = () => {
    return (
        <PageTransition>
            <ErrorBoundary>
                <Pricing />
            </ErrorBoundary>
        </PageTransition>
    );
};
