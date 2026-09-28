// ==========================================
// AVL TREE NODE
// ==========================================

class AVLNode {

    constructor(value) {

        this.value = value;

        this.left = null;
        this.right = null;

        this.height = 1;
    }
}


// ==========================================
// AVL TREE
// ==========================================

class AVLTree {

    constructor() {

        this.root = null;
    }


    // Get height
    getHeight(node) {

        if (node === null) {
            return 0;
        }

        return node.height;
    }


    // Update height
    updateHeight(node) {

        node.height =
            1 +
            Math.max(
                this.getHeight(node.left),
                this.getHeight(node.right)
            );
    }


    // Get balance factor
    getBalance(node) {

        if (node === null) {
            return 0;
        }

        return (
            this.getHeight(node.left) -
            this.getHeight(node.right)
        );
    }


    // ======================================
    // RIGHT ROTATION
    // ======================================

    rightRotate(y) {

        const x = y.left;

        const temp = x.right;

        x.right = y;

        y.left = temp;

        this.updateHeight(y);

        this.updateHeight(x);

        return x;
    }


    // ======================================
    // LEFT ROTATION
    // ======================================

    leftRotate(x) {

        const y = x.right;

        const temp = y.left;

        y.left = x;

        x.right = temp;

        this.updateHeight(x);

        this.updateHeight(y);

        return y;
    }


    // ======================================
    // INSERT
    // ======================================

    insert(node, value) {

        // Create new node
        if (node === null) {

            return new AVLNode(value);
        }


        // Insert into left subtree
        if (value < node.value) {

            node.left =
                this.insert(node.left, value);
        }


        // Insert into right subtree
        else if (value > node.value) {

            node.right =
                this.insert(node.right, value);
        }


        // Duplicate
        else {

            return node;
        }


        // Update height
        this.updateHeight(node);


        // Balance factor
        const balance =
            this.getBalance(node);


        // ==================================
        // LL CASE
        // ==================================

        if (
            balance > 1 &&
            value < node.left.value
        ) {

            return this.rightRotate(node);
        }


        // ==================================
        // RR CASE
        // ==================================

        if (
            balance < -1 &&
            value > node.right.value
        ) {

            return this.leftRotate(node);
        }


        // ==================================
        // LR CASE
        // ==================================

        if (
            balance > 1 &&
            value > node.left.value
        ) {

            node.left =
                this.leftRotate(node.left);

            return this.rightRotate(node);
        }


        // ==================================
        // RL CASE
        // ==================================

        if (
            balance < -1 &&
            value < node.right.value
        ) {

            node.right =
                this.rightRotate(node.right);

            return this.leftRotate(node);
        }


        return node;
    }


    // ======================================
    // DELETE
    // ======================================

    delete(node, value) {

        if (node === null) {

            return null;
        }


        // Search left
        if (value < node.value) {

            node.left =
                this.delete(node.left, value);
        }


        // Search right
        else if (value > node.value) {

            node.right =
                this.delete(node.right, value);
        }


        // Found node
        else {

            // No child
            if (
                node.left === null &&
                node.right === null
            ) {

                return null;
            }


            // Only right child
            if (node.left === null) {

                return node.right;
            }


            // Only left child
            if (node.right === null) {

                return node.left;
            }


            // Two children
            let successor =
                node.right;


            while (successor.left !== null) {

                successor =
                    successor.left;
            }


            node.value =
                successor.value;


            node.right =
                this.delete(
                    node.right,
                    successor.value
                );
        }


        // Update height
        this.updateHeight(node);


        // Get balance
        const balance =
            this.getBalance(node);


        // ==================================
        // LL
        // ==================================

        if (
            balance > 1 &&
            this.getBalance(node.left) >= 0
        ) {

            return this.rightRotate(node);
        }


        // ==================================
        // LR
        // ==================================

        if (
            balance > 1 &&
            this.getBalance(node.left) < 0
        ) {

            node.left =
                this.leftRotate(node.left);

            return this.rightRotate(node);
        }


        // ==================================
        // RR
        // ==================================

        if (
            balance < -1 &&
            this.getBalance(node.right) <= 0
        ) {

            return this.leftRotate(node);
        }


        // ==================================
        // RL
        // ==================================

        if (
            balance < -1 &&
            this.getBalance(node.right) > 0
        ) {

            node.right =
                this.rightRotate(node.right);

            return this.leftRotate(node);
        }


        return node;
    }


    // ======================================
    // SEARCH
    // ======================================

    search(node, value) {

        if (node === null) {

            return null;
        }


        if (node.value === value) {

            return node;
        }


        if (value < node.value) {

            return this.search(
                node.left,
                value
            );
        }


        return this.search(
            node.right,
            value
        );
    }


    // ======================================
    // INORDER TRAVERSAL
    // ======================================

    inorder(node, result = []) {

        if (node === null) {

            return result;
        }


        this.inorder(
            node.left,
            result
        );


        result.push(node.value);


        this.inorder(
            node.right,
            result
        );


        return result;
    }
}


// ==========================================
// CREATE TREE
// ==========================================

const avl = new AVLTree();


// ==========================================
// HTML ELEMENTS
// ==========================================

const valueInput =
    document.getElementById("valueInput");

const treeNodes =
    document.getElementById("treeNodes");

const treeSvg =
    document.getElementById("treeSvg");

const message =
    document.getElementById("message");


// ==========================================
// INSERT
// ==========================================

function insertNode() {

    const value =
        Number(valueInput.value);


    if (valueInput.value === "") {

        showMessage(
            "Please enter a value."
        );

        return;
    }


    if (
        avl.search(
            avl.root,
            value
        )
    ) {

        showMessage(
            "Duplicate value is not allowed."
        );

        return;
    }


    avl.root =
        avl.insert(
            avl.root,
            value
        );


    valueInput.value = "";


    renderTree();


    showMessage(
        "Inserted " + value
    );
}


// ==========================================
// DELETE
// ==========================================

function deleteNode() {

    const value =
        Number(valueInput.value);


    if (valueInput.value === "") {

        showMessage(
            "Please enter a value."
        );

        return;
    }


    if (
        !avl.search(
            avl.root,
            value
        )
    ) {

        showMessage(
            "Value not found."
        );

        return;
    }


    avl.root =
        avl.delete(
            avl.root,
            value
        );


    valueInput.value = "";


    renderTree();


    showMessage(
        "Deleted " + value
    );
}


// ==========================================
// SEARCH
// ==========================================

function searchNode() {

    const value =
        Number(valueInput.value);


    if (valueInput.value === "") {

        showMessage(
            "Please enter a value."
        );

        return;
    }


    clearHighlight();


    const found =
        avl.search(
            avl.root,
            value
        );


    if (found) {

        const element =
            document.querySelector(
                `[data-value="${value}"]`
            );


        if (element) {

            element.classList.add(
                "found"
            );
        }


        showMessage(
            "Found " + value
        );

    } else {

        showMessage(
            "Value " + value +
            " was not found."
        );
    }
}


// ==========================================
// RESET
// ==========================================

function resetTree() {

    avl.root = null;

    renderTree();

    showMessage(
        "Tree reset successfully."
    );
}


// ==========================================
// MESSAGE
// ==========================================

function showMessage(text) {

    message.textContent = text;
}


// ==========================================
// CLEAR HIGHLIGHT
// ==========================================

function clearHighlight() {

    document
        .querySelectorAll(".node")
        .forEach(node => {

            node.classList.remove(
                "found"
            );
        });
}


// ==========================================
// CALCULATE POSITIONS
// ==========================================

function calculatePositions() {

    const positions = [];

    const width = 1100;

    const levelGap = 100;


    function calculate(
        node,
        depth,
        left,
        right
    ) {

        if (node === null) {

            return;
        }


        const x =
            (left + right) / 2;


        const y =
            60 + depth * levelGap;


        positions.push({
            node: node,
            x: x,
            y: y
        });


        calculate(
            node.left,
            depth + 1,
            left,
            x - 40
        );


        calculate(
            node.right,
            depth + 1,
            x + 40,
            right
        );
    }


    calculate(
        avl.root,
        0,
        60,
        width - 60
    );


    return positions;
}


// ==========================================
// RENDER TREE
// ==========================================

function renderTree() {

    treeNodes.innerHTML = "";

    treeSvg.innerHTML = "";


    if (avl.root === null) {

        updateInfo();

        return;
    }


    const positions =
        calculatePositions();


    const positionMap =
        new Map();


    positions.forEach(item => {

        positionMap.set(
            item.node,
            item
        );
    });


    // Draw edges
    positions.forEach(item => {

        const node = item.node;


        if (node.left) {

            drawLine(
                item,
                positionMap.get(
                    node.left
                )
            );
        }


        if (node.right) {

            drawLine(
                item,
                positionMap.get(
                    node.right
                )
            );
        }
    });


    // Draw nodes
    positions.forEach(item => {

        const node = item.node;


        const div =
            document.createElement("div");


        div.className = "node";


        div.dataset.value =
            node.value;


        div.style.left =
            item.x + "px";


        div.style.top =
            item.y + "px";


        const balance =
            avl.getBalance(node);


        div.innerHTML = `

            <div class="value">
                ${node.value}
            </div>

            <div class="details">
                H:${node.height}
                BF:${balance}
            </div>

        `;


        treeNodes.appendChild(div);
    });


    updateInfo();
}


// ==========================================
// DRAW LINE
// ==========================================

function drawLine(parent, child) {

    const line =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );


    line.setAttribute(
        "x1",
        parent.x
    );


    line.setAttribute(
        "y1",
        parent.y
    );


    line.setAttribute(
        "x2",
        child.x
    );


    line.setAttribute(
        "y2",
        child.y
    );


    line.classList.add("edge");


    treeSvg.appendChild(line);
}


// ==========================================
// UPDATE INFORMATION
// ==========================================

function updateInfo() {

    document.getElementById(
        "rootValue"
    ).textContent =
        avl.root
            ? avl.root.value
            : "-";


    document.getElementById(
        "treeHeight"
    ).textContent =
        avl.getHeight(
            avl.root
        );


    const values =
        avl.inorder(
            avl.root
        );


    document.getElementById(
        "nodeCount"
    ).textContent =
        values.length;


    document.getElementById(
        "traversalOutput"
    ).textContent =
        values.length
            ? values.join(" → ")
            : "Empty";
}


// ==========================================
// ENTER KEY
// ==========================================

valueInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            insertNode();
        }
    }
);


// ==========================================
// INITIAL TREE
// ==========================================

const initialValues = [
    50,
    30,
    70,
    20,
    40,
    60,
    80
];


initialValues.forEach(value => {

    avl.root =
        avl.insert(
            avl.root,
            value
        );
});


renderTree();
