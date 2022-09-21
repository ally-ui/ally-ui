/** @jsxImportSource react */
import type {FunctionComponent} from 'react';

interface FrameworkSelectProps {
	framework?: string | undefined;
}

const FrameworkSelect: FunctionComponent<FrameworkSelectProps> = ({
	framework,
}) => {
	return <>{framework ?? 'No framework'}</>;
};

export default FrameworkSelect;
