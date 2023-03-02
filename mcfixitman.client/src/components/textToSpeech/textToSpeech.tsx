import * as React from 'react';

import { CustomerServiceOutlined, MessageOutlined } from '@ant-design/icons';

import { Switch } from 'antd';

interface TextToSpeechProps {
    textToRead: string;
}



export const TextToSpeech: React.FC<TextToSpeechProps> = (props) => {
    const [isEnabled, setIsEnabled] = React.useState(false);

    // const resumeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    // const pauseResumeTimer = (): void => {
    //     speechSynthesis.pause();
    //     speechSynthesis.resume();

    //     resumeTimer.current = setTimeout(pauseResumeTimer, 5000);
    // };

    const speakAsync = React.useCallback(async () => {
        return new Promise<void>((resolve, reject) => {
            speechSynthesis.cancel();

            if (!!props.textToRead && isEnabled) {
                // resumeTimer.current = setTimeout(pauseResumeTimer, 5000);

                const utterance = new SpeechSynthesisUtterance(props.textToRead);
                utterance.rate = 1;

                const voices = speechSynthesis.getVoices();

                const preferredVoice = voices.find((voice) => voice.voiceURI === 'Google UK English Male');
                const secondaryVoice = voices.find((voice) => voice.localService === true && voice.voiceURI.toLowerCase().includes('united kingdom'));
                const tertiaryVoice = voices.find((voice) => voice.localService === true);


                utterance.voice = preferredVoice ?? secondaryVoice ?? tertiaryVoice ?? voices[0] ?? null;
                utterance.lang = utterance.voice?.lang ?? 'en';

                utterance.onend = (e) => {
                    // if (!!resumeTimer.current) {
                    //     clearTimeout(resumeTimer.current);
                    // }

                    resolve();
                };

                utterance.onerror = (e) => {
                    reject(e);
                };

                speechSynthesis.speak(utterance);
            }
        });
    }, [props.textToRead]);

    React.useEffect(() => {
        speechSynthesis.getVoices();

        return () => {
            speechSynthesis.cancel();
            // if (!!resumeTimer.current) {
            //     clearTimeout(resumeTimer.current);
            // }
        };
    }, []);

    React.useEffect(() => {
        if (!isEnabled) {
            speechSynthesis.cancel();
        }
    }, [isEnabled]);

    React.useEffect(() => {
        speakAsync();

    }, [props.textToRead]);

    return (
        <div>
            <Switch
                style={{ transform: 'scale(1.2)' }}
                checked={isEnabled}
                checkedChildren={<CustomerServiceOutlined />}
                unCheckedChildren={<MessageOutlined />}
                onChange={(newIsEnabled) => {
                    setIsEnabled(newIsEnabled);
                }}
            />
        </div>
    );
};