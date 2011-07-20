var customExample = {
    nodes : [
//        {
//            id : 'complex1',
//            sbo : x,
//            data : {
//                x : 0,
//                y : 0,
//                label : '',
//                subnodes : ['complex1'],
//                modification : [
//                   [
//                      216,
//                      '1068'
//                   ]
//                ]
//            }
//        },
        {
            id : 'node1',
            sbo : 253,
            data : {
                x : 100,
                y : 500,
                "subnodes" : [
                   'node2',
                   'node3'
                ]
                // TODO state variable 'tense'
            }
        }, {
            id : 'node2',
            sbo : 245,
            data : {
                label : 'actin'
            }
        }, {
            id : 'node3',
            sbo : 245,
            data : {
                label : 'myosin'
            }
        }, {
            id : 'node4',
            sbo : 253,
            data : {
                x : 610,
                y : 525,
                "subnodes" : [
                    'node5',
                    'node6',
                    'node7'
                ]
                // TODO state variable 'relaxed'
            }
        }, {
            id : 'node5',
            sbo : 245,
            data : {
                label : 'actin'
            }
        }, {
            id : 'node6',
            sbo : 245,
            data : {
                label : 'myosin'
            }
        }, {
            id : 'node7',
            sbo : 247,
            data : {
                label : 'ATP'
            }
        }, {
            id : 'node8',
            sbo : 247,
            data : {
                label : 'ADP',
                x : 380,
                y : 445
            }
        }, {
            id : 'node9',
            sbo : 247,
            data : {
                label : 'Pi',
                x : 495,
                y : 455
            }
        }, {
            id : 'node10',
            sbo : 375,
            data : {
                x : 490,
                y : 550
            }
        }, {
            id : 'node11',
            sbo : 375, // TODO change to dissociation
            data : {
                x : 255,
                y : 380
            }
        }, {
            id : 'node12',
            sbo : 245,
            data : {
                label : 'myosin',
                x : 220,
                y : 245
            }
        }
    ],
    edges : {

    }
};