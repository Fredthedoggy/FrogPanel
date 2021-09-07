import React, { useEffect, useState } from 'react';
import tw from 'twin.macro';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faLayerGroup, faTimes, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { css } from 'styled-components/macro';

let setPanelShown: React.Dispatch<React.SetStateAction<boolean>> | undefined;

export function Category (props: { name: string, children: React.ReactNode }) {
    return (
        <div css={tw`flex flex-col my-4 space-y-2`}>
            <div css={tw`text-sm px-5 text-secondary-400`}>{props.name}</div>
            {props.children}
        </div>);
}

export function Link (props: { name: string, icon: IconProp, react?: boolean, link: string, exact?: boolean }) {
    return props.react ?? false ? (
        <NavLink to={props.link} exact={props.exact ?? false} css={tw`flex flex-row`} className={'navigation-link'}
            onClick={() => setPanelShown ? setPanelShown(false) : undefined}
        >
            <p css={tw`text-lg`}>{props.name}</p>
            <div css={tw`w-8 h-8 inline-flex items-center ml-auto`}>
                <FontAwesomeIcon icon={props.icon} size={'lg'} css={tw`mx-auto`}/>
            </div>
        </NavLink>
    ) : (
        <a href={props.link} rel={'noreferrer'} css={tw`flex flex-row`} className={'navigation-link'}>
            <p css={tw`text-lg`}>{props.name}</p>
            <div css={tw`w-8 h-8 inline-flex items-center ml-auto`}>
                <FontAwesomeIcon icon={props.icon} size={'lg'} css={tw`mx-auto`}/>
            </div>
        </a>
    );
}

export default (props: { children?: React.ReactNode, panelShown: boolean, setPanelShown: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const name = useStoreState((state: ApplicationStore) => state.settings.data!.name);
    const rootAdmin = useStoreState((state: ApplicationStore) => state.user.data!.rootAdmin);
    const panelShown = props.panelShown;
    setPanelShown = props.setPanelShown;

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

    return (
        <div css={css`
            left: 0;
            transition-property: left;

            ${tw`duration-1000 md:transition bg-neutral-700 h-screen shadow-lg flex flex-col w-screen md:w-56 px-4 py-2 fixed top-0 md:left-0`};
            ${panelShown ? '' : css`left: calc(0px - 100vw)`};

            z-index: 1000;

            & > div > div > .navigation-link {

                ${tw`p-2 rounded-md`};

                &:active, &:hover {
                    ${tw`text-neutral-100`};
                }

                &:hover {
                    ${tw`shadow-sm bg-secondary-800`}
                }

                &:active, &.active {
                    ${tw`shadow-lg bg-secondary-400`}
                }
            }
        }
        `}
        >
            {windowSize.width < 768 && (
                <button onClick={() => setPanelShown ? setPanelShown(false) : undefined}>
                    <FontAwesomeIcon icon={faTimes} size={'lg'}/>
                </button>
            )}
            <div css={tw`overflow-y-auto overflow-x-hidden`}>
                <div css={tw`text-2xl mx-auto my-12 text-center`}>{name}</div>
                <Category name={'ABOUT'}>
                    <Link name={'Servers'} icon={faLayerGroup} react link={'/'} exact/>
                    <Link name={'Account'} icon={faUserCircle} react link={'/account'} exact/>
                    {rootAdmin &&
                    <Link name={'Admin'} icon={faCogs} link={'/admin'}/>
                    }
                </Category>
                {props.children}
            </div>
        </div>
    );
};
