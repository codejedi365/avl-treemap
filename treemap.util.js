/**
 * TreeMap Utility v1.0.2
 * AVL Tree Balancing + KeyValMapping as Tree.fetch(key) returns tNode.data
 * codejedi365 | MIT License
 *
 * 
 * Supports Node.js, AMD and plain browser loading
 */
(function (root, factory) {
	'use strict';
	// https://github.com/umdjs/umd/blob/master/returnExports.js
	if (typeof module === 'object' && module.exports) {
		// Node
		module.exports = factory();									//options: { usePureJavaScript: false}
	} else if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(factory);
	} else {
		// Browser globals (root is window)
		root.TreeMap = factory(root);
	}
})(this, function (root) {
	
	var TreeMap = function () {
		Object.call();
		this.root = null;
		var tmap = this;

		this.first = function () {
			var nodeCapture = this.dfTraversal(function ( node, captureArray ) {
				captureArray[captureArray.length] = node.data;
				throw new TreeMap.StopSearchException("Found First Node's Data!");
			});
			return (nodeCapture.length > 0)? nodeCapture[0] : false ;
		};
		this.firstKey = function () {
			var nodeCapture = this.dfTraversal(function ( node, captureArray ) {
				captureArray[captureArray.length] = node.key;
				throw new TreeMap.StopSearchException("Found First Node's Key!");
			});
			return (nodeCapture.length > 0)? nodeCapture[0] : false ;
		};
		this.last = function () {
			var values = this.dfsValues();
			return values[values.length-1];
		};
		this.lastKey = function () {
			var keys = this.dfsKeys();
			return keys[keys.length-1];
		};
		this.fetch = function ( key ) { 
			var testNode = new tnode(key, null, null, null, null);
			var n = ( !this.root )? null : binarySearch(this.root, testNode);
			return (n != null)? n.data : null;
		};
		this.isKey = function ( key ) { 
			var testNode = new tnode(key, null, null, null, null);
			var n = ( !this.root )? null : binarySearch(this.root, testNode);
			return (n != null)? true : false;
		};
		this.keys = function () {
			return this.dfsKeys();
		};
		this.dfsKeys = function () {
			return this.dfTraversal(function ( node, captureArray ) {
				captureArray[captureArray.length] = node.key;
			});
		};
		this.bfsKeys = function () {
			return this.bfTraversal(function ( node, captureArray, depth ) {
				captureArray[captureArray.length] = node.key;
			});
		};
		this.values = function () {
			return this.dfsValues();
		};
		this.dfsValues = function () {
			return this.dfTraversal(function ( node, captureArray ) {
				captureArray[captureArray.length] = node.data;
			});
		};
		this.bfsValues = function () {
			return this.bfTraversal(function ( node, captureArray, depth ) {
				captureArray[captureArray.length] = node.data;
			});
		};
		this.allEntries = function () {
			return this.dfsEntries();
		};
		this.dfsEntries = function () {
			return this.dfTraversal(function ( node, captureArray ) {
				captureArray[captureArray.length] = { "key":node.key, "data":node.data };
			});
		};
		this.bfsEntries = function () {
			return this.bfTraversal(function ( node, captureArray, depth ) {
				captureArray[captureArray.length] = { "key":node.key, "data":node.data };
			});
		};
		this.size = function () {
			return this.keys().length;
		};
		var binarySearch = function ( head, node ) {
			var comparison = tmap.compare(head, node);
			if ( comparison == 0 ) {
				return head;
			} else if ( comparison == -1 && head.left != null ) {
				return binarySearch( head.left, node );
			} else if ( comparison == 1 && head.right != null) {
				return binarySearch( head.right, node );
			} else {
				return null;
			}
		};
		var insert = function (node, skipBalance) { 
			var compareNInsert = function (head, node) {
				var comparison = this.compare(head, node);
				if ( comparison > 0 ) {
					if ( head.right != null ) {
						if ( !arguments.callee.call(this, head.right, node) && head.height < head.right.height+1) {		// 
							head.height = head.right.height+1;
						}
					} else {
						head.right = node;
						if( head.height < head.right.height+1 ) head.height = head.right.height+1;
						node.setParent(head);
					}

				} else if ( comparison < 0 ) {
					if ( head.left != null ) {
						if ( !arguments.callee.call(this, head.left, node) && head.height < head.left.height+1){
							head.height = head.left.height+1;
						}
					} else {
						head.left = node;
						if( head.height < head.left.height+1 ) head.height = head.left.height+1;
						node.setParent(head);
					}

				} else {
					head.data = node.data;
					return false; 
				};

				return skipBalance? false : balanceTree.call(this, head) ;
			};
			return compareNInsert.call(this, this.root, node);
		};
		this.add = function (key, value) { 
			var newNode = new tnode(key, value, null, null, null);
			if (this.root != null) {
				insert.call(this, newNode, false);
			} else {
				this.root = newNode;
			}
//			console.log(tmap.bfsKeys());
			return tmap;
		};
		this.merge = function ( tree ) {
			return (TreeMap.prototype.isPrototypeOf(tree))? insertSubtree.call(this, tree, false) : false;
		};
		this.remove = function ( key ) {
			var testNode = new tnode(key, null, null, null, null);
			var n = binarySearch(this.root, testNode);
			if (n == null) return false;

			while ( n.left != null || n.right != null ) {				// Shift tree to move node to deepest depth aka the bottom of the tree
				var balanceFactor = calcBF(n);
				if ( balanceFactor > 0 ) {			// Left side heavier, move node to right side
					rotationRight.call( this, n, true );

				} else if ( balanceFactor < 0 ) {	// Right side heavier, move node to the left side
					rotationLeft.call( this, n, true );

				} else {			// balanced tree, autochoose right side
					rotationRight.call( this, n, true );
				}
			}

			var parent = n.root;
			if ( parent == null ) {				// node removed is last on tree, which means it is also the root
				this.root = null;
				return n;
			} else if ( parent.left === n ) {
				parent.left = null;
			} else {
				parent.right = null;
			}
			calcHeight(parent);
			if ( parent.height > 0 ) balanceTree.call(this, parent);

			if (parent.root == null) {
				this.root = parent;
			} else {
				while ( parent.root != null ) {
					parent = parent.root;
					balanceTree.call(this, parent);
				}
			}

			return n;
		};
		this.empty = function () {
			this.root = null;
			return this;
		};

		this.dfTraversal = function ( nodeHandlerFn ) {
			var visited = new Array();
			if ( typeof nodeHandlerFn !== "function" || this.root == null ) return visited;

			var dfTraversal = function ( head ) {
				if ( head.left == null && head.right == null ) {
					nodeHandlerFn.call(this, head, visited);

				} else {
					if ( head.left != null ) {
						arguments.callee.call(this, head.left );
					}
					nodeHandlerFn.call(this, head, visited);
					if ( head.right != null ) {
						arguments.callee.call(this, head.right );
					}
				}
			};

			try {
				dfTraversal.call(this, this.root);
			} catch (err) {
				if ( !(err instanceof TreeMap.StopSearchException) ) throw err;
			}
			return visited;
		};
		this.bfTraversal = function ( nodeHandlerFn ) {
			var visited = new Array();
			if ( typeof nodeHandlerFn !== "function" || this.root == null ) return visited;

			var bfTraversal = function ( head, depth ) {
				if ( depth === undefined ) {							// Tree root given
					depth = 0;											// Breath-First-Search starts with depth = 0
					while ( depth <= head.height ) {
						arguments.callee.call(this, head, depth++ );
					};

				} else if ( depth === 0 ) {								//depth = 0
					nodeHandlerFn.call(this, head, visited, depth);

				} else {
					if ( head.left != null ) {
						arguments.callee.call(this, head.left, depth-1 );
					}
					if ( head.right != null ) {
						arguments.callee.call(this, head.right, depth-1 );
					}
				}
				return;
			};

			try {
				bfTraversal.call(this, this.root);
			} catch (err) {
				if ( !(err instanceof TreeMap.StopSearchException) ) throw err;
			}
			return visited;
		};
		this.subtree = function ( start ) {
			var subRoot = (tnode.prototype.isPrototypeOf(start))? start : binarySearch(this.root, new tnode(start, null, null, null, null)) ;
			return (subRoot == null)? false : setRoot(this.nakedClone(), subRoot);
		};
		var setRoot = function ( tree, newRoot ) {
			tree.root = newRoot.setParent(null);
			return tree;
		};
		var calcBF = function ( head ) {
			var leftSubTreeHeight = (head.left != null)? head.left.height+1 : 0; 
			var rightSubTreeHeight = (head.right != null)? head.right.height+1 : 0;
			return leftSubTreeHeight - rightSubTreeHeight; 
		};

		var balanceTree = function ( head ) {

			var balanceFactor = calcBF(head);
			if ( -1 <= balanceFactor && balanceFactor <= 1 ) {					// defines interval or values -1,0,1
				return false;

			} else if ( balanceFactor == 2 ) {
				var childBF = calcBF(head.left);
				if ( childBF == 1 ) {
					head = rotationRight.call( this, head );

				} else if ( childBF == -1 ) {
					head.left = rotationLeft.call( this, head.left );
					head = rotationRight.call( this, head );
				}

			} else if ( balanceFactor == -2 ) {
				var childBF = calcBF(head.right);
				if ( childBF == 1 ) {
					head.right = rotationRight.call( this, head.right );
					head = rotationLeft.call( this, head );

				} else if ( childBF == -1 ) {
					head = rotationLeft.call( this, head );
				}
			}
			if ( head.root == null ) this.root = head;
			return true;
		};

		var calcHeight = function ( head ) {
			if ( head.right == null && head.left == null ) {
				return (head.height = 0);
			} else {
				if ( head.right != null ) {
					arguments.callee( head.right );
				}
				if ( head.left != null ) {
					arguments.callee( head.left );
				}
			}
		};

		var rotationLeft = function ( head, skipBalance ) {
			var parentNode = head.root;
			var parentSide = (parentNode == null)? 0 : ((parentNode.left === head )? 1 : -1 );
			var newHead = head.right;
			head.right = null;

			var subtree = setRoot(this.subtree(head), newHead);
			var subtreeRoot = (insertSubtree.call(subtree, head, skipBalance)).root;

			// Re-attach parent to subtree
			if ( parentSide == 1 ) {
				parentNode.left = subtreeRoot.setParent( parentNode );
			} else if ( parentSide == -1 ) {
				parentNode.right = subtreeRoot.setParent( parentNode );
			}

			return subtreeRoot;
		};
		var rotationRight = function ( head, skipBalance ) { 
			var parentNode = head.root;
			var parentSide = (parentNode == null)? 0 : ((parentNode.left === head )? 1 : -1 );
			var newHead = head.left;
			head.left = null;

			var subtree = setRoot(this.subtree(head), newHead);
			var subtreeRoot = (insertSubtree.call(subtree, head, skipBalance)).root;

			// Re-attach parent to subtree
			if ( parentSide == 1 ) {
				parentNode.left = subtreeRoot.setParent( parentNode );
			} else if ( parentSide == -1 ) {
				parentNode.right = subtreeRoot.setParent( parentNode );
			}

			return subtreeRoot;
		};

		var insertSubtree = function ( subtree, skipBalance ) {
			var tree = (tnode.prototype.isPrototypeOf(subtree))? setRoot(new TreeMap(), subtree) : subtree ;

			var breathKeys = tree.bfsKeys(); 
			var nodes = Array();
			for (var k=breathKeys.length-1; k >= 0; k--) {
				var testNode = new tnode(breathKeys[k], null, null, null, null);
				nodes.unshift( binarySearch(tree.root, testNode).strip() );
			}

			while ( nodes.length > 0 ) {
				insert.call(this, nodes.shift(), skipBalance );
			}
			return this;
		};

		var tnode = function(key, data, parent, left, right){  
			this.key = key;
			this.data = data;
			this.root = parent;
			this.left = left;
			this.right = right;
			this.height = 0;
			this.setParent = function ( node ) {	this.root = node;return this;	};
			this.setHeight = function ( val ) {		this.height = val;return this;	};
			this.strip = function () { this.root=null; this.left=null; this.right=null; return this.setHeight(0); };
		};
		tnode.prototype.clone = function () {
			return new tnode(this.key, this.data, this.parent, this.left, this.right).setHeight(this.height);
		};

		TreeMap.StopSearchException = function (message) {
			Error.call(this, message);
			if ("captureStackTrace" in Error) {
				Error.captureStackTrace(this, TreeMap.StopSearchException);
			} else {
				this.stack = (new Error()).stack;
			}
		};
		TreeMap.StopSearchException.prototype = Object.create(Error.prototype);
		TreeMap.StopSearchException.prototype.name = "TreeMap.StopSearchException";
		TreeMap.StopSearchException.prototype.constructor = TreeMap.StopSearchException;
	};

	TreeMap.prototype.compare = function (node1, node2) {
		if ( !isNaN(node1.key) ) {
			return ( node1.key > node2.key )? -1 : (node1.key < node2.key)? 1 : 0 ;	
		} else if ( typeof(node1.key) === 'string' || node1.key instanceof String ) {
			return ( node1.key > node2.key )? -1 : (node1.key < node2.key)? 1 : 0 ;
		}
	};

	TreeMap.prototype.nakedClone = function () {
		var clone = Object.create( Object.getPrototypeOf( this ) );
		var keys = Object.getOwnPropertyNames( this );
		for (var i = 0; i < keys.length; i++) {
			if ( typeof this[keys[i]] === "function" ) {
				Object.defineProperty( clone, keys[i], Object.getOwnPropertyDescriptor(this, keys[i]) );
			} else {
				clone[keys[i]] = null;
			}
		}
		return clone;
	};

	TreeMap.prototype.print = function () {	
		var entries = this.allEntries();
		var str = "";
		entries.forEach( function (entry, index) {
			str += ((index==0)? "" : ", ") + entry.key+"='"+entry.data+"'";
		}); 
		console.log( "TreeMap:{ " + str + " }" );
	};
	
	return TreeMap;
	
});

