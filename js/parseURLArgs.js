function parseURLArgs(){
	var args = location.search.substring(1);
	var obj = {};
	args = args.split("&");
	var i = 0;
	while (i < args.length){
		args[i] = args[i].split("=");
		obj[args[i][0]] = args[i][1];
		i++;
	};
	return obj;
};