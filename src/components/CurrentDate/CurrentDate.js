"use client";

import React, { useState, useEffect } from 'react';
import moment from 'moment';

import './CurrentDate.css';
import { useTranslations } from '@/hooks/useTranslations';

export const CurrentDate = () => {
    const t = useTranslations('footer');
    const [currentTime, setCurrentTime] = useState(moment().format('DD-MM-YYYY | HH:mm:ss'));

    const updateTime = () => {
        setCurrentTime(moment().format('DD-MM-YYYY | HH:mm:ss'));
    };

    useEffect(() => {
        const intervalId = setInterval(updateTime, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
        <div className="date">
            {t('local_date_and_Time')}: <span>{currentTime}</span>
        </div>
    );
};
