var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);
var altitude = [];
var ground;
var sea;
var stop = 0;

var onKeyDown = function(evt)
{
    var particleSystem = new BABYLON.ParticleSystem("particles", 3000, scene);

    switch (evt.keyCode)
    {
      case 81 : //'Q'
      {
        if (stop == 0)
        {
            spreadWater(particleSystem, 2,0,0,1000,3);
            particleSystem.minEmitBox = new BABYLON.Vector3(-50, 0, -50);
            particleSystem.maxEmitBox = new BABYLON.Vector3(50, 0, 50);
            particleSystem.gravity = new BABYLON.Vector3(0, 0, 0);
            stop++;
            break;
        }
      }
      case 87 : //'W'
      {
        if (stop == 0)
        {
            spreadWater(particleSystem, 0,40,0,900,1);
            particleSystem.minEmitBox = new BABYLON.Vector3(-50, 0, -50);
            particleSystem.maxEmitBox = new BABYLON.Vector3(50, 0, 50);
            particleSystem.gravity = new BABYLON.Vector3(0, -200, 0);
            stop++;
            break;
        }
      }
      case 69 : //'E'
      {
        if (stop == 0)
        {
            spreadWater(particleSystem, 0,0,50,1000000,3);
            particleSystem.minEmitBox = new BABYLON.Vector3(-50, 0, 0);
            particleSystem.maxEmitBox = new BABYLON.Vector3(50, 10, 0);
            particleSystem.gravity = new BABYLON.Vector3(0, -0.8, 0);
            stop++;
            break;
        }
      }
    }

     particleSystem.updateFunction = function ( particles )
    {

        for (var i = 0; i < particles.length; i++)
        {
            var particle1 = particles[i];
            var sz = (particle1.size / 2);
            particle1.age += this._scaleUpdateSpeed;
            if (particle1.position.y - sz > 1)
            {
                particle1.angle += particle1.angularSpeed * this._scaledUpdateSpeed;

                particle1.direction.scaleToRef(this._scaledUpdateSpeed, this._scaledDirection);
                particle1.position.addInPlace(this._scaledDirection);

                this.gravity.scaleToRef(this._scaledUpdateSpeed, this._scaledGravity);
                particle1.direction.addInPlace(this._scaledGravity);
            }
            if (particle1.position.y - sz <= 0)
                particle1.position.y = sz;
            if (particle1.position.x  + sz >= 50)
              particle1.position.x = 50 - sz;
            if (particle1.position.z  + sz >= 50)
              particle1.position.z = 50 - sz;
            if (particle1.position.x  - sz <= -50)
              particle1.position.x = -50 + sz;
            if (particle1.position.z  - sz <= -50)
              particle1.position.z = -50 + sz;
            if (particle1.position.y - sz <= getAltitude(particle1.position.x, particle1.position.z))
            {
              var high = getAltitude(particle1.position.x, particle1.position.z) ;
              if (high > getAltitude(particle1.position.x - sz, particle1.position.z - sz))
              {
                particle1.position.x--;
                particle1.position.z--;
              }
              else if (high > getAltitude(particle1.position.x + sz, particle1.position.z + sz))
              {
                particle1.position.x++;
                particle1.position.z++;
              }
              else if (high > getAltitude(particle1.position.x - sz, particle1.position.z + sz) && getAltitude(particle1.position.x - sz, particle1.position.z + sz) < getAltitude(particle1.position.x + sz, particle1.position.z - sz))
              {
                particle1.position.x--;
                particle1.position.z++;
              }
              else if (high > getAltitude(particle1.position.x + sz, particle1.position.z - sz))
              {
                particle1.position.x++;
                particle1.position.z--;
              }
            }
            for (var j = i + 1; j < particles.length; j++)
            {
                var particle2 = particles[j];
                if (colliding(particle1, particle2, particle1.size))
                {
                    var delta = particle1.position.subtract(particle2.position);
                    var d = delta.length();
                    var tmp = ((particle1.size) -d) / d;
                    var mtd = delta.multiplyByFloats(tmp, tmp, tmp);
                    var im = 1 / 5;
                    var tmp = im / (im + im);
                    particle1.position.addInPlace(mtd.multiplyByFloats(tmp, tmp, tmp));
                    particle2.position.subtractInPlace(mtd.multiplyByFloats(tmp, tmp, tmp));
                    var v = particle1.direction.subtract(particle2.direction);
                    var vn = BABYLON.Vector3.Dot(v, mtd.normalize());
                    if (vn < 0.0)
                    {
                      var reduction = 0.5;
                      var i_ = (-(1.0 + reduction) * vn ) / (im + im) ;
                      var impulse = mtd.normalize().multiplyByFloats(i_, i_, i_);
                      particle1.direction.addInPlace(impulse.multiplyByFloats(im, im, im));
                      particle2.direction.subtractInPlace(impulse.multiplyByFloats(im, im, im));
                    }
                }
            }
        }
    };
};

var spreadWater = function(particleSystem, x, y, z, er, size)
{
   var fountain = BABYLON.Mesh.CreateBox("fountain", 1, scene);
    fountain.position.y = y;
    fountain.position.x = x;
    fountain.position.z = z;
    fountain.isVisible = false;
    particleSystem.particleTexture = new BABYLON.Texture("water.jpg", scene);
    particleSystem.minSize = size;
    particleSystem.maxSize = size;
    particleSystem.minEmitPower = 5;
    particleSystem.maxEmitPower = 5;
    particleSystem.emitter = fountain;
    particleSystem.emitRate = er;
    particleSystem.color1 = new BABYLON.Color4(0, 0, 153, 10);
    // particleSystem.color2 = new BABYLON.Color4(0, 0, 255, 0);
    // particleSystem.color1 = new BABYLON.Color4(0, 0, 50, 10);
    // particleSystem.color2 = new BABYLON.Color4(0.01, 0.01, 1, 0);
    // particleSystem.textureMask = new BABYLON.Color4(1.3, 1.3, 0, 0.01);
    particleSystem.direction1 = new BABYLON.Vector3(-1, -1, -1);
    particleSystem.direction2 = new BABYLON.Vector3(1, -1, 1);
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    particleSystem.start();
};


var colliding = function(elem1, elem2 , sz)
{
    var xd = elem1.position.x - elem2.position.x;
    var yd = elem1.position.y - elem2.position.y;
    var zd = elem1.position.z - elem2.position.z;

    var sumRadius = sz;
    var sqrRadius = sumRadius * sumRadius;

    var distSqr = (xd * xd) + (yd * yd) + (zd * zd);

    if (distSqr <= sqrRadius)
    {
        return true;
    }

    return false;
};

var CreateArrayOfAltitude = function( positions )
{
    for ( var i = 0; i < 100 ; i++ )
    {
        altitude[100 - i - 50] = [];
        for ( var j = 0; j < 100; j++ )
        {
            altitude[100 - i - 50][j - 50] = positions[ getCustomIndex( i, j ) ];
        };
    };
};

var getCustomIndex = function( x, y )
{
        return ( ( x * (100 + 1) + y ) * 3 + 1 );
};

var getAltitude = function( x, y )
{
    if (isNaN(x) || isNaN(y))
        return 0;
    if ( (Math.round(y) >= altitude.length || Math.round(y) < -49 ) )
        return 0;
    if ( (Math.round(x) >= altitude[Math.round(y)].length || Math.round(x) < -49) )
        return 0;

    var alt =  altitude[Math.round( y )][Math.round( x )] + ground.position.y;

    if (alt)
        return alt;
    else
        return 0;
};

var draw = function(positions, pos, size){
    var numberPoints = positions.length;
    for (var i = 0; i < numberPoints; i+=3)
    {
        if (positions[i] == pos[0] && positions[i+2] == pos[2] )
        {
            for (var deg = 0; deg < 360; deg+= 0.012)
            {
                for (var dist = 0; dist < pos[1]; dist+= 0.1)
                {
                    var x = Math.round(dist * Math.cos(deg));
                    var z = Math.round(dist * Math.sin(deg));
                    var h = (pos[1]/2) + ((pos[1] - positions[i + x *(size + 1)*3 + z*3 + 1])/2) * Math.cos( Math.PI / pos[1] * dist );
                    if (positions[i + x *(size + 1)*3 + z*3 + 1] < h)
                         positions[i + x *(size + 1)*3 + z*3 + 1] = h;
                }
            }
        }
    }
    return positions;
}

var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 150, 150), scene);
    camera.setTarget(BABYLON.Vector3.Zero());

    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.6;

    var materialGround1 = new BABYLON.StandardMaterial("texture1", scene);
    materialGround1.diffuseTexture = new BABYLON.Texture("sable.jpg", scene);
    var colorMaterial = new BABYLON.StandardMaterial("text1", scene);

    ground = BABYLON.Mesh.CreateGround("ground", 100, 100, 100, scene);
    ground.material = materialGround1;


    var positions = ground.getVerticesData("position");
    i = 0;
    for (var i in array_points_js)
    {
      var pos = array_points_js[i].split(',');
      positions = draw(positions, pos, 100);
      i++;
    }
    CreateArrayOfAltitude(positions);

    ground.setVerticesData(BABYLON.VertexBuffer.PositionKind, positions);


    this.addEventListener("keydown", onKeyDown);

    ground.setVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
     ground.convertToFlatShadedMesh();

    return scene;

  };

var scene = createScene();
	engine.runRenderLoop(function () {
	scene.render();
});

window.addEventListener("resize", function () {
	engine.resize();
});
