
var simplescript = require('../');

function compile(text) {
    return simplescript.compile(text);
}

exports['Compile integer'] = function (test) {
    test.equal(compile('123'), '123;');
}

exports['Compile string without quotes inside'] = function (test) {
    test.equal(compile("'foo'"), "'foo';");
    test.equal(compile('"foo"'), "'foo';");
}

exports['Compile name'] = function (test) {
    test.equal(compile("foo"), "var foo; foo;");
}

exports['Compile indexed name'] = function (test) {
    test.equal(compile("foo[1]"), "var foo; foo[1];");
}

exports['Compile indexed assignment'] = function (test) {
    test.equal(compile("foo[1] = 42"), "var foo; foo[1] = 42;");
}

exports['Unclosed command'] = function (test) {
    test.throws(function() {
        compile('foo bar');
    },
    function(err) {
        test.ok(err);
        test.equal(err, "unexpected 'bar'");
        return true;
    });
}

exports['Compile if'] = function (test) {
    test.equal(compile("if a b"), "var a, b; if (a) { b; }");
    test.equal(compile("if a\n b\n end"), "var a, b; if (a) { b; }");
}

exports['Compile while'] = function (test) {
    test.equal(compile("while a b"), "var a, b; while (a) { b; }");
    test.equal(compile("while a\n b\n end"), "var a, b; while (a) { b; }");
}

exports['Compile for'] = function (test) {
    test.equal(compile("for k in n b"), "var k, n, b; for (k in n) { b; }");
    test.equal(compile("for k in n\n b\n end"), "var k, n, b; for (k in n) { b; }");
}

exports['Compile return'] = function (test) {
    test.equal(compile("return"), "return;");
    test.equal(compile("return 1"), "return 1;");
    test.equal(compile("return a"), "var a; return a;");
}

exports['Compile continue'] = function (test) {
    test.equal(compile("continue"), "continue;");
}

exports['Compile break'] = function (test) {
    test.equal(compile("break"), "break;");
}

exports['Compile if with else'] = function (test) {
    test.equal(compile("if a b else c"), "var a, b, c; if (a) { b; } else { c; }");
    test.equal(compile("if a\nb\nelse\nc\nend"), "var a, b, c; if (a) { b; } else { c; }");
    test.equal(compile("if a\n b\n c\nend"), "var a, b, c; if (a) { b; c; }");
}

exports['Unclosed if command'] = function (test) {
    test.throws(function() {
        compile('if a\nb');
    },
    function(err) {
        test.ok(err);
        test.equal(err, "expected 'end'");
        return true;
    });
}

exports['Compile commands'] = function (test) {
    test.equal(compile("a\nb\n"), "var a, b; a; b;");
    test.equal(compile("if a b\nif c d"), "var a, b, c, d; if (a) { b; } if (c) { d; }");
    test.equal(compile("a=1"), "var a; a = 1;");
    test.equal(compile("a+=1"), "var a; a += 1;");
    test.equal(compile("a-=1"), "var a; a -= 1;");
    test.equal(compile("a*=2"), "var a; a *= 2;");
    test.equal(compile("a/=3"), "var a; a /= 3;");
    test.equal(compile("a=b"), "var a, b; a = b;");
}

exports['Compile assign to indexed name'] = function (test) {
    test.equal(compile("a[2]=1"), "var a; a[2] = 1;");
    test.equal(compile("a[1]+=1"), "var a; a[1] += 1;");
    test.equal(compile("a[1]-=1"), "var a; a[1] -= 1;");
    test.equal(compile("a[2]*=2"), "var a; a[2] *= 2;");
    test.equal(compile("a[1]/=3"), "var a; a[1] /= 3;");
    test.equal(compile("a[2]=b"), "var a, b; a[2] = b;");
}

exports['Compile external call'] = function (test) {
    test.equal(compile("print('hello')"), "print('hello');");
}

exports['Compile external call with two arguments'] = function (test) {
    test.equal(compile("print(a, b)"), "var a, b; print(a, b);");
}

exports['Compile function'] = function (test) {
    test.equal(compile("function foo() return 42"), "function foo() { return 42; }");
    test.equal(compile("function add(a, b) return a+b"), "function add(a, b) { return a + b; }");
}

exports['Compile anonymous function'] = function (test) {
    test.equal(compile("function () return 42"), "function () { return 42; }");
    test.equal(compile("function (a, b) return a+b"), "function (a, b) { return a + b; }");
}
