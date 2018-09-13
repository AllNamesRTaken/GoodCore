    function isObject(it) {
        return it !== null && typeof it === "object";
    }
    function isArray(it) {
        return Array.isArray ? Array.isArray(it) : Object.prototype.toString.call(it) === "[object Array]";
    }
    function forEach(target, fn) {
        if(isArray(target)) {
            target.forEach(fn);
        } else {
            Object.entries(target).forEach(([key, value]) => fn(value, key));
        }
    }
    function objReduce(obj, fn, acc) {
        let a = acc;
        forEach(obj, (value, key) => {
            if(isObject(value) || isArray(value)) {
                a = objReduce(value, fn, a);
            } 
            a = fn(a, value, key);
        });
        return a;
    }

    objReduce(obj, (acc, cur, key) => {
        if(key === "mobile") {
            acc.push(cur);
        }
        return acc;
    }, []);


    let obj = {
        "id": 12345,
        "name": "John Doe",
        "emergencyContacts": [{
            "name": "Jane Doe",
            "phone": "888-555-1212",
            "relationship": "spouse",
            "moreDetails": {
              "id": 12345,
              "phones": {},
              "home": "800-123-4567",
              "mobile": "877-123-1234"
            }
          },
          {
            "name": "Justin Doe",
            "phone": "877-123-1212",
            "relationship": "parent",
            "mobile": "877-123-1234"
          }
        ],
        "workContacts": [{
            "name": "Jane Doe",
            "phone": "888-555-1212",
            "relationship": "spouse",
            "moreworkDetails": {
              "id": 12345,
              "phones": {},
              "home": "800-123-4567",
              "mobile": "877-123-1236"
            }
          },
          {
            "name": "Justin Doe",
            "phone": "877-123-1212",
            "relationship": "parent",
            "mobile": "877-123-1235"
          }
        ]
      };