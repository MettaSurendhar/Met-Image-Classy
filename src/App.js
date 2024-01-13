import './App.css';
import { useState, useEffect, useRef } from 'react';
import '@tensorflow/tfjs-backend-webgl';
import * as mobilenet from '@tensorflow-models/mobilenet';

function App() {
	const [isModelLoading, setIsModelLoading] = useState(false);
	const [model, setModel] = useState(null);
	const [imageUrl, setImageUrl] = useState(null);
	const [isImageValid, setIsImageValid] = useState(false);
	const [results, setResults] = useState(null);

	const imageRef = useRef();
	const textInputRef = useRef();
	const fileInputRef = useRef();

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
		textInputRef.current.value = '';
		const { files } = e.target;
		if (files.length > 0) {
			setIsImageValid(true);
			setImageUrl(URL.createObjectURL(files[0]));
		} else {
			setIsImageValid(false);
			setImageUrl(null);
		}
	};

	const identify = async () => {
		textInputRef.current.value = '';
		fileInputRef.current.value = '';
		const results = await model.classify(imageRef.current);
		setResults(results);
	};

	const cancel = async () => {
		textInputRef.current.value = '';
		fileInputRef.current.value = '';
		setIsImageValid(false);
	};

	const validateImageUrl = (url) => {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = () => resolve(true);
			img.onerror = () => reject(false);
			img.src = url;
		});
	};

	const handleOnChange = (e) => {
		fileInputRef.current.value = '';
		validateImageUrl(e.target.value)
			.then((result) => {
				setIsImageValid(true);
			})
			.catch((err) => {
				setIsImageValid(false);
			});
		setImageUrl(e.target.value);
		setResults([]);
	};

	const triggerUpload = () => {
		fileInputRef.current.click();
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
					className='uploadFileInput'
					type='file'
					accept='image/*'
					capture='camera'
					ref={fileInputRef}
					onChange={uploadImage}
				/>
				<button
					className='uploadImg'
					onClick={triggerUpload}
				>
					upload image
				</button>
				<span className='or'> OR </span>
				<input
					className='uploadTextInput'
					type='text'
					placeholder='Paster Image URL'
					ref={textInputRef}
					onChange={handleOnChange}
				/>
			</div>
			<div className='mainWrapper'>
				<div className='mainContent'>
					<div className='imageHolder'>
						{isImageValid && imageUrl && (
							<img
								src={imageUrl}
								alt='Upload preview'
								crossOrigin='anonymous'
								ref={imageRef}
							/>
						)}
					</div>
					{isImageValid && imageUrl && (
						<div className='buttonHolder'>
							<button
								className='button'
								onClick={identify}
							>
								Identify
							</button>
							<button
								className='button cancel'
								onClick={cancel}
							>
								cancel
							</button>
						</div>
					)}
				</div>
				{results !== null && results.length > 0 && (
					<div className='resultsHolder'>
						{results.map((result, index) => {
							return (
								<div
									className='result'
									key={result.className}
								>
									<span className='name'>{result.className}</span>
									<span className='confidence'>
										Confidence level : {(result.probability * 100).toFixed(2)}%
										{index === 0 && (
											<span className='bestGuess'>Best Guess</span>
										)}
									</span>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}

export default App;
