import React, { useEffect, useRef, useState } from 'react';
import { Field, Form, Formik, FormikHelpers, useFormikContext } from 'formik';
import { Actions, useStoreActions, useStoreState } from 'easy-peasy';
import { object, string } from 'yup';
import debounce from 'debounce';
import FormikFieldWrapper from '@/components/elements/FormikFieldWrapper';
import InputSpinner from '@/components/elements/InputSpinner';
import getServers from '@/api/getServers';
import { Server } from '@/api/server/getServer';
import { ApplicationStore } from '@/state';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import tw from 'twin.macro';
import Input from '@/components/elements/Input';

interface Values {
    term: string;
}

const ServerResult = styled(Link)`
    ${tw`flex items-center bg-neutral-800 p-4 rounded border-l-4 border-neutral-800 no-underline transition-all duration-150`};

    &:hover {
        ${tw`shadow border-cyan-500`};
    }

    &:not(:last-of-type) {
        ${tw`mb-2`};
    }
`;

const SearchWatcher = () => {
    const { values, submitForm } = useFormikContext<Values>();

    useEffect(() => {
        if (values.term.length >= 3) {
            submitForm();
        }
    }, [ values.term ]);

    return null;
};

export default ({ ...props }: {
    visible: boolean;
    appear: boolean;
    onDismissed: () => void;
}) => {
    const ref = useRef<HTMLInputElement>(null);
    const isAdmin = useStoreState(state => state.user.data!.rootAdmin);
    const [ servers, setServers ] = useState<Server[]>([]);
    const history = useHistory();
    const {
        clearAndAddHttpError,
        clearFlashes,
    } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

    const search = debounce(({ term }: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes('search');

        // if (ref.current) ref.current.focus();
        getServers({ query: term, type: isAdmin ? 'admin-all' : undefined })
            .then(servers => setServers(servers.items.filter((_, index) => index < 5)))
            .catch(error => {
                console.error(error);
                clearAndAddHttpError({ key: 'search', error });
            })
            .then(() => setSubmitting(false))
            .then(() => ref.current?.focus());
    }, 500);

    useEffect(() => {
        if (props.visible) {
            if (ref.current) ref.current.focus();
        }
    }, [ props.visible ]);

    const divRef: React.RefObject<HTMLInputElement> = React.createRef();

    useEffect(() => {
        function handleClickOutside (event: MouseEvent) {
            if (!event.target || !(event.target instanceof HTMLElement) || (divRef && divRef.current?.contains(event.target))) {
                props.onDismissed();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const InputWithRef = (props: any) => <Input autoFocus {...props} autoComplete={'off'} css={tw`h-10`} ref={ref}/>;

    return (
        <Formik
            ref={divRef}
            onSubmit={search}
            validationSchema={object().shape({
                term: string().min(3, 'Please Use 3 or More Characters.'),
            })}
            initialValues={{ term: '' } as Values}
        >
            {({ isSubmitting }) => (
                <div
                    css={`${tw`flex flex-col rounded-md bg-neutral-900 z-40 mb-auto p-2`} ${props.visible ? tw`block` : tw`hidden`}`}
                >
                    <Form>
                        <FormikFieldWrapper
                            name={'term'}
                        >
                            <SearchWatcher/>
                            <InputSpinner visible={isSubmitting}>
                                <Field as={InputWithRef} name={'term'}/>
                            </InputSpinner>
                        </FormikFieldWrapper>
                    </Form>
                    {servers.length > 0 &&
                    <div css={tw`mt-6`}>
                        {
                            servers.map(server => (
                                <ServerResult
                                    key={server.uuid}
                                    to={`/server/${server.id}`}
                                    onClick={() => {
                                        history.push(`/server/${server.id}`);
                                        props.onDismissed();
                                    }}
                                >
                                    <div css={tw`flex-1 mr-4`}>
                                        <p css={tw`text-sm`}>{server.name}</p>
                                        <p css={tw`mt-1 text-xs text-neutral-400`}>
                                            {
                                                server.allocations.filter(alloc => alloc.isDefault).map(allocation => (
                                                    <span
                                                        key={allocation.ip + allocation.port.toString()}
                                                    >{allocation.alias || allocation.ip}:{allocation.port}
                                                    </span>
                                                ))
                                            }
                                        </p>
                                    </div>
                                    <div css={tw`flex-none text-right`}>
                                        <span css={tw`text-xs py-1 px-2 bg-cyan-800 text-cyan-100 rounded`}>
                                            {server.node}
                                        </span>
                                    </div>
                                </ServerResult>
                            ))
                        }
                    </div>
                    }
                </div>
            )}
        </Formik>
    );
};
