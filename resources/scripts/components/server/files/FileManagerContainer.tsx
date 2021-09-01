import React, { useEffect } from 'react';
import { httpErrorToHuman } from '@/api/http';
import FileManagerBreadcrumbs from '@/components/server/files/FileManagerBreadcrumbs';
import NewDirectoryButton from '@/components/server/files/NewDirectoryButton';
import { NavLink, useLocation } from 'react-router-dom';
import Can from '@/components/elements/Can';
import { ServerError } from '@/components/elements/ScreenBlock';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import { ServerContext } from '@/state/server';
import useFileManagerSwr from '@/plugins/useFileManagerSwr';
import UploadButton from '@/components/server/files/UploadButton';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import { useStoreActions } from '@/state/hooks';
import ErrorBoundary from '@/components/elements/ErrorBoundary';
import { FileActionCheckbox } from '@/components/server/files/SelectFileCheckbox';
import { hashToPath } from '@/helpers';
import FileViewer from '@/components/server/files/FileViewer';

export default () => {
    const id = ServerContext.useStoreState(state => state.server.data!.id);
    const { hash } = useLocation();
    const { data: files, error, mutate } = useFileManagerSwr();
    const directory = ServerContext.useStoreState(state => state.files.directory);
    const clearFlashes = useStoreActions(actions => actions.flashes.clearFlashes);
    const setDirectory = ServerContext.useStoreActions(actions => actions.files.setDirectory);

    const setSelectedFiles = ServerContext.useStoreActions(actions => actions.files.setSelectedFiles);
    const selectedFilesLength = ServerContext.useStoreState(state => state.files.selectedFiles.length);

    useEffect(() => {
        clearFlashes('files');
        setSelectedFiles([]);
        setDirectory(hashToPath(hash));
    }, [ hash ]);

    useEffect(() => {
        mutate();
    }, [ directory ]);

    const onSelectAllClick = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFiles(e.currentTarget.checked ? (files?.map(file => file.name) || []) : []);
    };

    if (error) {
        return (
            <ServerError message={httpErrorToHuman(error)} onRetry={() => mutate()}/>
        );
    }

    return (
        <ServerContentBlock title={'File Manager'} showFlashKey={'files'}>
            <div css={tw`flex flex-wrap-reverse md:flex-nowrap justify-center mb-4`}>
                <ErrorBoundary>
                    <FileManagerBreadcrumbs
                        renderLeft={
                            <FileActionCheckbox
                                type={'checkbox'}
                                css={tw`mx-4`}
                                checked={selectedFilesLength === (files?.length === 0 ? -1 : files?.length)}
                                onChange={onSelectAllClick}
                            />
                        }
                    />
                </ErrorBoundary>
                <Can action={'file.create'}>
                    <ErrorBoundary>
                        <div
                            css={tw`flex flex-shrink-0 flex-wrap-reverse md:flex-nowrap justify-end mb-4 md:mb-0 ml-0 md:ml-auto`}
                        >
                            <NewDirectoryButton css={tw`w-full flex-none mt-4 sm:mt-0 sm:w-auto sm:mr-4`}/>
                            <UploadButton css={tw`flex-1 mr-4 sm:flex-none sm:mt-0`}/>
                            <NavLink
                                to={`/server/${id}/files/new${window.location.hash}`}
                                css={tw`flex-1 sm:flex-none sm:mt-0`}
                            >
                                <Button css={tw`w-full`}>
                                    New File
                                </Button>
                            </NavLink>
                        </div>
                    </ErrorBoundary>
                </Can>
            </div>
            <FileViewer/>
        </ServerContentBlock>
    );
};
