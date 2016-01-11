var jsOptics = (function() {
this.Ray = function(r, theta) {
	this.height = r;
	this.angle = theta;
};

this.GaussBeam = function(a,b) {
	this.re = a;
	this.im = b;
};

this.Component = function(A,B,C,D) {
	this.A = A;
	this.B = B;
	this.C = C;
	this.D = D;
};

this.Distance = function(d) {
	this.A = 1;
	this.B = d;
	this.C = 0;
	this.D = 1;
};

this.Lens = function(f) {
	this.A = 1;
	this.B = 0;
	this.C = -1/f;
	this.D = 1;
};

this.Indice = function(n,n1) {
	this.A = 1;
	this.B = 0;
	this.C = 0;
	if (arguments.length === 2) {
		this.D = n/n1;
	} else {
		this.D = n;
	}
};

this.System = function(A,B,C,D) {
	if (arguments.length === 0) {
		this.A = 1;
		this.B = 0;
		this.C = 0;
		this.D = 1;
	} else if (arguments.length === 4) {
		this.A = A;
		this.B = B;
		this.C = C;
		this.D = D;
	};

	this.components = [];

	this.addComponent = function(component) {
		nSystem = new System(component.A*this.A+component.B*this.C, component.A*this.B+component.B*this.D, component.C*this.A+component.D*this.C, component.C*this.B+component.D*this.D);
		nSystem.components = this.components.concat([component]);
		return nSystem;
	};

	this.addComponentS = function(component) {
		var nSystem = new System(this.A*component.A+this.B*component.C, this.A*component.B+this.B*component.D, this.C*component.A+this.D*component.C, this.C*component.B+this.D*component.D);
		nSystem.components = ([component]).concat(this.components);
		return nSystem;
	};

	this.imageLocation = function() {
		// B === 0 for imaging
		if(this.D === 0){
			return false;
		} else {
			return -this.B/this.D;
		};
	};

	this.completeImage = function() {
		if(this.D === 0){
			return false;
		} else {
			return this.addComponent(new Distance(-this.B/this.D));
		};
	};

	this.determinant = function() {
		return this.A*this.D-this.B*this.C;
	};

	this.simplify = function() {
		return (new System).addComponent(new Distance((this.D-this.determinant())/this.C)).addComponent(new Indice(this.determinant())).addComponent(new Lens(-1/this.C)).addComponent(new Distance((this.A-1)/C));
	};

	this.rayTransform = function(ray) {
		return (new Ray(this.A*ray.height+this.B*ray.angle, this.C*ray.height+this.D*ray.angle));
	};

	this.beamTransform = function(beam) {
		var div, r, i;
		div = (this.C*beam.re+this.D)*(this.C*beam.re+this.D)+this.C*this.C*beam.im*beam.im;
		r = (this.D+this.C*beam.re)*(this.A*beam.re+this.B)+this.A*this.C*beam.im*beam.im;
		i = this.A*beam.im*(this.D+this.C*beam.re)-this.C*beam.im*(this.A*beam.re+this.B);
		return (new GaussBeam(r/div,i/div));
	};

	this.eigenBeam = function() {
		var r, i;
		r = (this.A-this.D)/2;
		i = Math.sqrt(-4*this.B*this.C-(this.D-this.A)*Math.abs((this.D-this.A))/2/this.C);
		if (isNaN(i)) {
			return false;
		} else {
			return (new GaussBeam(r,i));
		}
	}
};

return this;
})();