
export const errorHandler = (err, req, res, next) =>{
	console.log(`[${err.name}] ${err.message}`);
  const status = err.statusCode || 500; 
	res.status(status).json({
		error: err.name || 'Error', 
		message: err.message || 'Internal Server Error',
	})
};
