import React, { useEffect } from "react"
import { navigate } from 'gatsby';

const IndexPage = (props) => {

	useEffect(() => {
		setTimeout(() => {
			navigate('/app');
		}, 2500);
	});

	return (
		<div className="h-screen w-full flex flex-col justify-center items-center">
			<div className="text-3xl font-bold" style={{ animation: `spinLoad 3s linear infinite` }}>Gemserve</div>
			<div className="text-base font-semibold">Welcome to Gemserve Bulk Attendance...</div>
		</div>
	)
}

export default IndexPage