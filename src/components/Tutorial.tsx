import React from 'react';
import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';

interface TutorialProps {
  steps: Step[];
  run: boolean;
  onClose: () => void;
}

export default function Tutorial({ steps, run, onClose }: TutorialProps) {
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as any)) {
      onClose();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#8b5cf6',
          textColor: '#ffffff',
          backgroundColor: '#111111',
          arrowColor: '#111111',
          overlayColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: 10000,
        },
        tooltipContainer: {
          borderRadius: '24px',
          padding: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        buttonNext: {
          backgroundColor: '#8b5cf6',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: 'bold',
          padding: '10px 20px',
        },
        buttonBack: {
          color: 'rgba(255, 255, 255, 0.6)',
          marginRight: '10px',
        },
        buttonSkip: {
          color: 'rgba(255, 255, 255, 0.4)',
        },
      }}
      locale={{
        back: 'Voltar',
        close: 'Fechar',
        last: 'Finalizar',
        next: 'Próximo',
        skip: 'Pular',
      }}
    />
  );
}
