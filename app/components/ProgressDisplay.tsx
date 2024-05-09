"use client";
import { CircularProgress, CircularProgressLabel, Stack, Text} from '@chakra-ui/react';

type ProgressDisplayProps = {
    timeRemaining: number,
    tabIndex: number,
    timeDefinitions: {
        workTime: number,
        breakTime: number,
    },
    cycleCount: number,
    isTimerRunning: boolean,
}

export default function ProgressDisplay({ tabIndex, timeRemaining, timeDefinitions, cycleCount, isTimerRunning }: ProgressDisplayProps) {

    const progress = isTimerRunning ? 100 - ((timeRemaining / (tabIndex === 0 ? timeDefinitions.workTime : timeDefinitions.breakTime)) * 100) : 0;

    const formatTime = (seconds: number) => {
        if(!seconds) return "";
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <CircularProgress
            value={progress}
            size={300}
            thickness={5}
            capIsRound
            color={`${tabIndex === 0 ? 'red.500' : 'blue.500'}`}
            trackColor={`${tabIndex === 0 ? 'red.100' : 'blue.100'}`}
        >
            <CircularProgressLabel>
            <Stack direction="column" spacing={4} mt={10}>
                <Text fontSize="6xl" fontWeight="600">{formatTime(timeRemaining)}</Text>
                <Text fontSize="xl" fontWeight="500">{`#${cycleCount}`}</Text>
            </Stack>
                
            </CircularProgressLabel>
        </CircularProgress>
    );
};
