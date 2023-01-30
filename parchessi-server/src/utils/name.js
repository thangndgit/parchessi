exports.getType = (name) => name.split("-")[0];

exports.getOrder = (name) => Number(name.split("-")[1]);
