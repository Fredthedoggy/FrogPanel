import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import SearchContainer from '@/components/dashboard/search/SearchContainer';
import tw from 'twin.macro';
import styled from 'styled-components/macro';
import http from '@/api/http';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import { useEffect, useState } from 'react';

const Navigation = styled.div`
    ${tw`w-full bg-neutral-900 shadow-md overflow-x-auto overflow-visible`};

    & > div {
        ${tw`mx-auto w-full flex items-center`};
    }
`;

const NavigationSection = styled.div`
    ${tw`flex h-full items-center justify-center`};

    & > a, & > button, & > .navigation-link {
        ${tw`flex items-center h-full no-underline text-neutral-300 px-6 cursor-pointer transition-all duration-150  border-secondary-400`};

        &:active, &:hover {
            ${tw`text-neutral-100 bg-black`};
        }

        &:active, &:hover, &.active {
            ${tw`border-b-2`};
        }
    }
`;

export default (props: { setPanelShown: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [ windowSize, setWindowSize ] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const [ isLoggingOut, setIsLoggingOut ] = useState(false);

    const onTriggerLogout = () => {
        setIsLoggingOut(true);
        http.post('/auth/logout').finally(() => {
            // @ts-ignore
            window.location = '/';
        });
    };
    useEffect(() => {
        function handleResize () {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        }

        window.addEventListener('resize', () => setWindowSize({ width: window.innerWidth, height: window.innerHeight }));
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const setPanelShown = props.setPanelShown;

    return (
        <Navigation>
            <SpinnerOverlay visible={isLoggingOut} />
            <div css={tw`mx-auto w-full flex items-center`} style={{ height: '3.5rem' }}>
                {windowSize.width < 768 && (
                    <NavigationSection>
                        <a onClick={() => setPanelShown(true)}>
                            <FontAwesomeIcon icon={faBars}/>
                        </a>
                    </NavigationSection>
                )}
                <NavigationSection css={tw`ml-auto`}>
                    <SearchContainer/>
                    <button onClick={onTriggerLogout}>
                        <FontAwesomeIcon icon={faSignOutAlt}/>
                    </button>
                </NavigationSection>
            </div>
        </Navigation>
    );
};
