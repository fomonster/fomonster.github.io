
// -------------------------------------------------------------------

function station() {

	var geometry = new THREE.Geometry();

	var s = 100;
	var radius = s;
	
	vertices = [
		-s, 0, s,
		0, -s, s,
		s, 0, s,
		0, s, s,
		-s, 0, -s,
		0, -s, -s,
		s, 0, -s,
		0, s, -s,
		-s, s, 0,
		0, s, -s,
		s, s, 0,
		0, s, s,
		-s, -s, 0,
		0, -s, -s,
		s, -s, 0,
		0, -s, s,

		-s * 0.3,  -s*1.01, -s * 0.1,
		s * 0.3,  -s*1.01, -s * 0.1,
		s * 0.3,  -s*1.01, s * 0.1,
		-s * 0.3,  -s*1.01, s * 0.1,
	]

	for(var i=0;i<vertices.length;i+=3) {
		geometry.vertices.push(new THREE.Vector3(vertices[i], vertices[i+1], vertices[i+2]));
	}

	faces = [
		0, 1, 2,
		2, 3 ,0,
		4, 6, 5,
		6, 4 ,7,
		8, 10, 9,
		10, 8, 11,
		12, 13, 14,
		14, 15, 12,
		0, 12, 1,
		2, 10, 3,
		1, 14, 2,
		3, 8, 0, 
		4, 5, 12,
		6, 7, 10,
		5, 6, 14,
		7, 4, 8,
		0, 4, 12,
		0, 8, 4,
		2, 14, 6,
		2, 6, 10,

		16,17,18,
		16,18,19,
	]

	for(var i=0;i<faces.length;i+=3) {
		geometry.faces.push(new THREE.Face3(faces[i], faces[i+1], faces[i+2]));
	}

	var faceIndices = [ 'a', 'b', 'c' ];
	for ( var i = 0; i < geometry.faces.length; i ++ ) {

		var f  = geometry.faces[ i ];

		for( var j = 0; j < 3; j++ ) {

			vertexIndex = f[ faceIndices[ j ] ];

			var p = geometry.vertices[ vertexIndex ];

			var color = new THREE.Color( 0x000000 );
			if ( i < geometry.faces.length-2 ) {
				color.setHSL( ( p.y / radius + 3 ) / 20, 1.0, 0.5 );
			}		

			f.vertexColors[ j ] = color;

		}

	}

	return geometry;

}

// -------------------------------------------------------------------

function spaceshipA() {

	var geometry = new THREE.Geometry();

	var s = 100;
	var radius = s;
	
	vertices = [
		-s, 0, s,
		0, -s, s,
		s, 0, s,
		0, s, s,
		-s, 0, -s,
		0, -s, -s,
		s, 0, -s,
		0, s, -s,
		-s, s, 0,
		0, s, -s,
		s, s, 0,
		0, s, s,
		-s, -s, 0,
		0, -s, -s,
		s, -s, 0,
		0, -s, s,

		-s * 0.3,  -s*1.01, -s * 0.1,
		s * 0.3,  -s*1.01, -s * 0.1,
		s * 0.3,  -s*1.01, s * 0.1,
		-s * 0.3,  -s*1.01, s * 0.1,
	]

	for(var i=0;i<vertices.length;i+=3) {
		geometry.vertices.push(new THREE.Vector3(vertices[i], vertices[i+1], vertices[i+2]));
	}

	faces = [
		0, 1, 2,
		2, 3 ,0,
		4, 6, 5,
		6, 4 ,7,
		8, 10, 9,
		10, 8, 11,
		12, 13, 14,
		14, 15, 12,
		0, 12, 1,
		2, 10, 3,
		1, 14, 2,
		3, 8, 0, 
		4, 5, 12,
		6, 7, 10,
		5, 6, 14,
		7, 4, 8,
		0, 4, 12,
		0, 8, 4,
		2, 14, 6,
		2, 6, 10,

		16,17,18,
		16,18,19,
	]

	for(var i=0;i<faces.length;i+=3) {
		geometry.faces.push(new THREE.Face3(faces[i], faces[i+1], faces[i+2]));
	}

	var faceIndices = [ 'a', 'b', 'c' ];
	for ( var i = 0; i < geometry.faces.length; i ++ ) {

		var f  = geometry.faces[ i ];

		for( var j = 0; j < 3; j++ ) {

			vertexIndex = f[ faceIndices[ j ] ];

			var p = geometry.vertices[ vertexIndex ];

			var color = new THREE.Color( 0x000000 );
			if ( i < geometry.faces.length-2 ) {
				color.setHSL( ( p.y / radius + 3 ) / 20, 1.0, 0.5 );
			}		

			f.vertexColors[ j ] = color;

		}

	}

	return geometry;

}

// -------------------------------------------------------------------

function icosahedron() {
	radius = 200;
	var geometry  = new THREE.IcosahedronGeometry( radius, 3 );
	var faceIndices = [ 'a', 'b', 'c' ];
	for ( var i = 0; i < geometry.faces.length; i ++ ) {

		var f  = geometry.faces[ i ];

		for( var j = 0; j < 3; j++ ) {

			vertexIndex = f[ faceIndices[ j ] ];

			var p = geometry.vertices[ vertexIndex ];

			var color = new THREE.Color( 0xffffff );
			color.setHSL( Math.abs( p.z / radius - 0.4 ) / 4, 1.0, 0.7 );

			f.vertexColors[ j ] = color;

		}

	}
	return geometry;
}

// -------------------------------------------------------------------
