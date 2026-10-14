const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');
const start = html.indexOf('function PhotoPickerButton(');
const end = html.indexOf('function Lightbox(', start);
assert.ok(start >= 0 && end > start);

function render() {
  const events = [];
  const selected = [];
  const refs = [];
  const context = {
    React: { Fragment: 'fragment' },
    useRef() {
      const index = refs.length;
      const ref = { current: { click() { events.push(index === 0 ? 'camera' : 'gallery'); } } };
      refs.push(ref);
      return ref;
    },
    useState: () => [true, value => events.push(['open', value])],
    setTimeout() { assert.fail('Native picker must not be deferred'); },
    e: (type, props, ...children) => ({ type, props: props || {}, children: children.flat(Infinity) }),
  };
  vm.createContext(context);
  vm.runInContext(html.slice(start, end), context);
  const tree = context.PhotoPickerButton({ onFiles: files => selected.push(files) });
  const nodes = node => !node || typeof node !== 'object' ? [] : [node, ...node.children.flatMap(nodes)];
  return { nodes: nodes(tree), events, selected };
}

for (const [label, source] of [['Сфотографировать', 'camera'], ['Из галереи', 'gallery']]) {
  test(`${source} picker opens synchronously before the menu closes`, () => {
    const { nodes, events } = render();
    const button = nodes.find(n => n.type === 'button' && n.children.some(c => typeof c === 'string' && c.includes(label)));
    assert.ok(button);
    assert.equal(button.props.type, 'button');
    button.props.onClick();
    assert.deepEqual(events, [source, ['open', false]]);
  });
}

test('both inputs deliver copied files and reset for selecting the same photo again', () => {
  const { nodes, selected } = render();
  const inputs = nodes.filter(n => n.type === 'input');
  assert.equal(inputs.length, 2);
  assert.equal(inputs[0].props.capture, 'environment');
  assert.equal(inputs[1].props.capture, undefined);
  for (const input of inputs) {
    assert.equal(input.props.accept, 'image/*');
    const file = { name: 'tablet.jpg' };
    const target = { files: [file], value: 'tablet.jpg' };
    input.props.onChange({ target });
    assert.equal(target.value, '');
    assert.equal(selected.at(-1)[0], file);
    input.props.onChange({ target: { files: [], value: '' } });
  }
  assert.equal(selected.length, 2);
});
