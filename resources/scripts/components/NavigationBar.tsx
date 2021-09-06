import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import SearchContainer from '@/components/dashboard/search/SearchContainer';
import tw, { theme } from 'twin.macro';
import styled from 'styled-components/macro';

const Navigation = styled.div`
    ${tw`w-full bg-neutral-900 shadow-md overflow-x-auto`};

    & > div {
        ${tw`mx-auto w-full flex items-center`};
    }
`;

const RightNavigation = styled.div`
    ${tw`flex h-full items-center justify-center`};

    & > a, & > .navigation-link {
        ${tw`flex items-center h-full no-underline text-neutral-300 px-6 cursor-pointer transition-all duration-150`};

        &:active, &:hover {
            ${tw`text-neutral-100 bg-black`};
        }

        &:active, &:hover, &.active {
            box-shadow: inset 0 -2px ${theme`colors.cyan.700`.toString()};
        }
    }
`;

export default () => {
    return (
        <Navigation>
            <div css={tw`mx-auto w-full flex items-center`} style={{ height: '3.5rem' }}>
                <RightNavigation css={tw`ml-auto`}>
                    <SearchContainer/>
                    <a href={'/auth/logout'}>
                        <FontAwesomeIcon icon={faSignOutAlt}/>
                    </a>
                </RightNavigation>
            </div>
        </Navigation>
    );
};
