import { useState, useEffect } from 'react';

type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface DeviceInfo {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    deviceType: DeviceType;
    width: number;
    height: number;
    orientation: 'portrait' | 'landscape';
    hasTouch: boolean;
}

export const useDeviceDetect = (): DeviceInfo => {
    // Default to desktop values during SSR
    const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        deviceType: 'desktop',
        width: 1920,
        height: 1080,
        orientation: 'landscape',
        hasTouch: false,
    });

    useEffect(() => {
        // Only run on client-side
        if (typeof window === 'undefined') return;

        // Function to calculate device type
        const calculateDeviceType = (): DeviceInfo => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            const orientation = height > width ? 'portrait' : 'landscape';

            // Set breakpoints for device types
            const isMobile = width < 768;
            const isTablet = width >= 768 && width < 1024;
            const isDesktop = width >= 1024;
            const deviceType: DeviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';

            return {
                isMobile,
                isTablet,
                isDesktop,
                deviceType,
                width,
                height,
                orientation,
                hasTouch,
            };
        };

        // Initial calculation
        setDeviceInfo(calculateDeviceType());

        // Add resize listener
        const handleResize = () => {
            setDeviceInfo(calculateDeviceType());
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);

        // Clean up
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
        };
    }, []);

    return deviceInfo;
};