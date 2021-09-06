import styled from 'styled-components/macro';
import { breakpoint } from '@/theme';
import tw from 'twin.macro';

const ContentContainer = styled.div`
    ${tw`mx-4`};

    ${breakpoint('xl')`
        ${tw`mx-6`};
    `};
`;
ContentContainer.displayName = 'ContentContainer';

export default ContentContainer;
