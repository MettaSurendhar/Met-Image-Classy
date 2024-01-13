import './App.css';
import { useState, useEffect, useRef } from 'react';
import * as mobilenet from '@tensorflow-models/mobilenet';

function App() {
	const [isModelLoading, setIsModelLoading] = useState(false);
	const [model, setModel] = useState(null);
	const [imageUrl, setImageUrl] = useState(null);

	const imageRef = useRef();

	const load = async () => {
		setIsModelLoading(true);
		try {
			const model = await mobilenet.load();
			setModel(model);
			setIsModelLoading(false);
		} catch (error) {
			console.log(error);
			setIsModelLoading(false);
		}
	};

	const uploadImage = (e) => {
		const { files } = e.target;
		if (files.length > 0) {
			setImageUrl(URL.createObjectURL(files[0]));
		} else {
			setImageUrl(null);
		}
	};

	useEffect(() => {
		load();
	}, []);

	if (isModelLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className='App'>
			<h1 className='header'>Image Classification</h1>
			<div className='inputHolder'>
				<input
					className='uploadInput'
					type='file'
					accept='image/*'
					capture='camera'
					onChange={uploadImage}
				/>
			</div>
			<div className='mainWrapper'>
				<div className='mainContent'>
					<div className='imageHolder'>
						{imageUrl && (
							<img
								src={imageUrl}
								alt='Upload preview'
								crossOrigin='anonymous'
								ref={imageRef}
							/>
						)}
					</div>
				</div>
				{imageUrl && <button className='button'>Identify Image</button>}
			</div>
		</div>
	);
}

export default App;
