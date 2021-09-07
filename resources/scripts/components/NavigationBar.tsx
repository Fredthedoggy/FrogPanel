import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSignOutAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import SearchContainer from '@/components/dashboard/search/SearchContainer';
import tw, { theme } from 'twin.macro';
import styled from 'styled-components/macro';
import { useEffect, useState } from 'react';

const Navigation = styled.div`
    ${tw`w-full bg-neutral-900 shadow-md overflow-x-auto`};

    & > div {
        ${tw`mx-auto w-full flex items-center`};
    }
`;

const NavigationSection = styled.div`
    ${tw`flex h-full items-center justify-center`};

    & > a, & > .navigation-link {
        ${tw`flex items-center h-full no-underline text-neutral-300 px-6 cursor-pointer transition-all duration-150`};

        &:active, &:hover {
            ${tw`text-neutral-100 bg-black`};
        }

        &:active, &:hover, &.active {
            ${tw`border-b-2 border-secondary-400`};
        }
    }
`;

export default (props: { setPanelShown: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [ windowSize, setWindowSize ] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
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
                    <a href={'/auth/logout'}>
                        <FontAwesomeIcon icon={faSignOutAlt}/>
                    </a>
                </NavigationSection>
            </div>
        </Navigation>
    );
};
