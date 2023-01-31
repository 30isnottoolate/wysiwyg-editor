const insertText = (text: string) => {
    const selection = document.getSelection();

    if (selection && selection.rangeCount) {
        const range = selection.getRangeAt(0);
        const textNode = document.createTextNode(text);

        range.deleteContents();
        range.insertNode(textNode);
        range.selectNode(textNode);
        range.collapse(false);

        selection.removeAllRanges();
        selection.addRange(range);
    }
}

const removeStyleTag = (node: Node | ChildNode | DocumentFragment, tag: string) => {
    if (node.hasChildNodes()) {

        node.childNodes.forEach((childNode) => {
            if (childNode.nodeName === tag && childNode.hasChildNodes()) {
                childNode.replaceWith(...childNode.childNodes);
                removeStyleTag(node, tag);
            } else if (childNode.nodeName === tag && !childNode.hasChildNodes()) {
                node.removeChild(childNode);
                removeStyleTag(node, tag);
            } else if (childNode.hasChildNodes()) {
                removeStyleTag(childNode, tag);
            }
        });
    }
}

const removeSpanTag = (node: Node | ChildNode | DocumentFragment, spanClass: string) => {
    if (node.hasChildNodes()) {

        node.childNodes.forEach((childNode) => {
            if (childNode.nodeName === "SPAN" && childNode.firstChild &&
                childNode.firstChild.parentElement && childNode.firstChild.parentElement.className === spanClass) {
                childNode.replaceWith(...childNode.childNodes);
                removeStyleTag(node, spanClass);
            } else if (childNode.nodeName === "SPAN" && !childNode.hasChildNodes()) {
                node.removeChild(childNode);
                removeStyleTag(node, spanClass);
            } else if (childNode.hasChildNodes()) {
                removeStyleTag(childNode, spanClass);
            }
        });
    }
}

const surroundWithStyleTag = (node: Node | ChildNode | DocumentFragment, style: string) => {
    const formatNode = document.createElement(style);

    formatNode.appendChild(node);

    return formatNode;
}

const removeDoubleFormatting = (node: Node, tag: string) => {
    if (node.hasChildNodes()) {
        node.childNodes.forEach(childNode => {
            if (childNode.nodeName === tag) {
                removeStyleTag(childNode, tag);
            } else {
                removeDoubleFormatting(childNode, tag);
            }
        });
    }
}

const mergeSiblings = (node: Node, tag: string) => {
    if (node.hasChildNodes()) {
        node.childNodes.forEach(childNode => {
            if (childNode.nodeName === tag && childNode.lastChild &&
                childNode.nextSibling && childNode.nextSibling.nodeName === tag &&
                childNode.nextSibling.hasChildNodes()) {
                childNode.lastChild.after(...childNode.nextSibling.childNodes);
                mergeSiblings(node, tag);
            } else {
                mergeSiblings(childNode, tag);
            }
        });
    }
}

const removeChildlessNodes = (node: Node) => {
    if (node.hasChildNodes()) {
        node.childNodes.forEach(childNode => {
            if (!childNode.hasChildNodes() &&
                childNode.nodeName !== "#text" && childNode.nodeName !== "BR") {
                node.removeChild(childNode);
                removeChildlessNodes(node);
            } else {
                removeChildlessNodes(childNode);
            }
        });
    }
}

const ancestorElementOfNode = (node: Node, ancestorNodeName: string) => {
    let ancestor = node.parentElement;

    const ancestorFinder = (node: Node, ancestorNodeName: string) => {
        if (node.parentElement) {
            if (node.parentElement.nodeName !== ancestorNodeName && node.parentElement.nodeName !== "DIV") {
                ancestorFinder(node.parentElement, ancestorNodeName);
            } else if (node.parentElement.nodeName === ancestorNodeName) {
                ancestor = node.parentElement;
            } else if (node.parentElement.nodeName === "DIV") {
                ancestor = document.createElement("SPAN");
                ancestor.className = "empty";
            }
        }
    }

    ancestorFinder(node, ancestorNodeName);

    if (!ancestor) {
        ancestor = document.createElement("SPAN");
        ancestor.className = "empty";
    }

    return ancestor;
}

const ancestorWithNextSibling = (node: Node) => {
    let ancestor = node;

    const ancestorFinder = (node: Node) => {
        if (node.parentNode && node.parentNode.nodeName !== "DIV") {
            if (node.parentNode.nextSibling) {
                ancestor = node.parentNode.nextSibling;
            } else ancestorFinder(node.parentNode);
        }
    }

    ancestorFinder(node);

    if (ancestor === node) {
        ancestor = topAncestorOfNode(node);
    }

    return ancestor;
}

const topAncestorOfNode = (node: Node) => {
    let ancestor = node;

    const ancestorFinder = (node: Node) => {
        if (node.parentNode) {
            if (node.parentNode.nodeName === "DIV") {
                ancestor = node;
            } else {
                ancestorFinder(node.parentNode);
            }
        }
    }

    ancestorFinder(node);

    return ancestor;
}

const doesNodeHaveAncestor = (node: Node, ancestorNodeName: string) => {
    let answer = false;

    const ancestorFinder = (node: Node, ancestorNodeName: string) => {
        if (node.parentNode) {
            if (node.parentNode.nodeName !== ancestorNodeName && node.parentNode.nodeName !== "DIV") {
                ancestorFinder(node.parentNode, ancestorNodeName);
            } else if (node.parentNode.nodeName === ancestorNodeName) {
                answer = true;
            } else if (node.parentNode.nodeName === "DIV") {
                answer = false;
            }
        }
    }

    ancestorFinder(node, ancestorNodeName);

    return answer;
}

const textNodesOfSelection = (startNode: Node, endNode: Node) => {
    const nodes: Node[] = [];

    const siblingsFinder = (startNode: Node, endNode: Node) => {
        if (startNode !== endNode) {
            if (startNode.nodeName === "#text") {
                nodes.push(startNode);
                if (startNode.nextSibling) {
                    siblingsFinder(startNode.nextSibling, endNode);
                } else if (startNode.parentNode && startNode.parentNode.nextSibling) {
                    siblingsFinder(startNode.parentNode.nextSibling, endNode);
                } else if (startNode.parentNode && !startNode.parentNode.nextSibling) {
                    siblingsFinder(ancestorWithNextSibling(startNode), endNode);
                }
            } else {
                if (startNode.firstChild) {
                    siblingsFinder(startNode.firstChild, endNode);
                } else if (startNode.nextSibling) {
                    siblingsFinder(startNode.nextSibling, endNode);
                }
            }
        } else {
            nodes.push(startNode);
        }
    }

    siblingsFinder(startNode, endNode);

    return nodes;
}

export {insertText, removeStyleTag, removeSpanTag, surroundWithStyleTag, removeDoubleFormatting, mergeSiblings, 
    removeChildlessNodes, ancestorElementOfNode, ancestorWithNextSibling, topAncestorOfNode, doesNodeHaveAncestor, textNodesOfSelection};
