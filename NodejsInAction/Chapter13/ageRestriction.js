var requiredAge = 18;

process.stdout.write("Please enter your age: ");
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(data){
	var age = parseInt(data, 10);
	if(isNaN(age)){
		console.log('%s is not a valid number', data);
		console.log('Please enter a valid number: ');
	}else if(age < 18){
		console.log('You must be at least %d to enter this bar, ' +
			'come back here in %d years',
			requiredAge, requiredAge-age);
			process.stdin.pause();
	}else{
		enterTheSecretDungeon();
			process.stdin.pause();
	}

});

process.stdin.resume();

function enterTheSecretDungeon(){
	console.log('Welcome to the programe.');
}
