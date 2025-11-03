interface ProjectIdPageProps {
	params: Promise<{
		projectId: string;
	}>;
}

const ProjectIdPage = async ({ params }: ProjectIdPageProps) => {
	const { projectId } = await params;

	return <div>ProjectId: {projectId}</div>;
};

export default ProjectIdPage;
