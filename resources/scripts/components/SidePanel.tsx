import React from 'react';
import tw, { theme } from 'twin.macro';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faLayerGroup, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import styled from 'styled-components/macro';

export function Category (props: { name: string, children: React.ReactNode }) {
    return (
        <div css={tw`flex flex-col my-4 space-y-2`}>
            <div css={tw`text-sm px-5`}>{props.name}</div>
            {props.children}
        </div>);
}

export function Link (props: { name: string, icon: IconProp, react?: boolean, link: string, exact?: boolean }) {
    return props.react ?? false ? (
        <NavLink to={props.link} exact={props.exact ?? false} css={tw`flex flex-row`} className={'navigation-link'}>
            <p css={tw`text-lg`}>{props.name}</p><FontAwesomeIcon icon={props.icon} size={'lg'} css={tw`ml-auto`}/>
        </NavLink>
    ) : (
        <a href={props.link} rel={'noreferrer'} css={tw`flex flex-row`} className={'navigation-link'}>
            <p css={tw`text-lg`}>{props.name}</p><FontAwesomeIcon icon={props.icon} size={'lg'} css={tw`ml-auto`}/>
        </a>
    );
}

export default (props: { children?: React.ReactNode }) => {
    const name = useStoreState((state: ApplicationStore) => state.settings.data!.name);
    const rootAdmin = useStoreState((state: ApplicationStore) => state.user.data!.rootAdmin);

    const PanelDiv = styled.div`
        ${tw`h-screen shadow-lg flex flex-col w-56 px-4 py-2 fixed top-0 left-0`};

        & > div > .navigation-link {

            ${tw`p-2 rounded-md`};

            border-left: 6px solid rgb(0 0 0 / 0%);

            &:active, &:hover {
                ${tw`text-neutral-100 bg-black`};
            }

            &:hover {
                border-left: 6px solid ${theme`colors.cyan.800`.toString()};
            }

            &:active, &.active {
                border-left: 6px solid ${theme`colors.cyan.700`.toString()};
            }
        }
    }
    `;

    return (
        <PanelDiv>
            <div css={tw`text-2xl mx-auto my-12`}>{name}</div>
            <Category name={'ABOUT'}>
                <Link name={'Servers'} icon={faLayerGroup} react link={'/'} exact/>
                <Link name={'Account'} icon={faUserCircle} react link={'/account'}/>
                {rootAdmin &&
                <Link name={'Admin'} icon={faCogs} link={'/admin'}/>
                }
            </Category>
            {props.children}
        </PanelDiv>
    );
};
