var FOV = {
	getFov : function(entity) {
		var fovList = {};
		var lightPassable = function(x, y) {
			if(entity.map.getTile(x, y).isWalkable)
				return true;
			return false;
		}
		var fovCallback = function(x, y, r, v)
		{
			fovList[x+","+y] = r;
		}
		var fov = new ROT.FOV.PreciseShadowcasting(lightPassable, {topology:8});
		fov.compute(entity.x, entity.y, 5, fovCallback);
		return fovList;
	}
}