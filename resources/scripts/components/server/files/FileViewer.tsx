import React, { useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import Spinner from '@/components/elements/Spinner';
import FileObjectRow from '@/components/server/files/FileObjectRow';
import { FileObject } from '@/api/server/files/loadDirectory';
import tw from 'twin.macro';
import useFileManagerSwr from '@/plugins/useFileManagerSwr';
import MassActionsBar from '@/components/server/files/MassActionsBar';
import { ServerContext } from '@/state/server';

const sortFiles = (files: FileObject[]): FileObject[] => {
    return files.sort((a, b) => a.name.localeCompare(b.name))
        .sort((a, b) => a.isFile === b.isFile ? 0 : (a.isFile ? 1 : -1));
};

export default (props: {
    details?: boolean;
    maxFiles?: number;
}) => {
    const details = props.details ?? true;
    const maxFiles = props.maxFiles ?? 250;

    const { data: files, mutate } = useFileManagerSwr();
    const directory = ServerContext.useStoreState(state => state.files.directory);

    useEffect(() => {
        mutate();
    }, [ directory ]);

    return (
        <>
            {
                !files ?
                    <Spinner size={'large'} centered/>
                    :
                    <>
                        {!files.length ?
                            <p css={tw`text-sm text-neutral-400 text-center`}>
                                This directory seems to be empty.
                            </p>
                            :
                            <CSSTransition classNames={'fade'} timeout={150} appear in>
                                <div>
                                    {files.length > maxFiles &&
                                    <div css={tw`rounded bg-yellow-400 mb-px p-3`}>
                                        <p css={tw`text-yellow-900 text-sm text-center`}>
                                            This directory is too large to display in the browser,
                                            limiting the output to the first {maxFiles} files.
                                        </p>
                                    </div>
                                    }
                                    {
                                        sortFiles(files.slice(0, maxFiles)).map(file => (
                                            <FileObjectRow details={details} key={file.key} file={file}/>
                                        ))
                                    }
                                    <MassActionsBar/>
                                </div>
                            </CSSTransition>
                        }
                    </>
            }
        </>);
};
