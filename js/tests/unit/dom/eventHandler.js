$(function () {
  'use strict'

  QUnit.module('event handler')

  QUnit.test('should be defined', function (assert) {
    assert.expect(1)
    assert.ok(EventHandler, 'EventHandler is defined')
  })

  QUnit.test('should trigger event correctly', function (assert) {
    assert.expect(1)

    var element = document.createElement('div')
    element.addEventListener('foobar', function () {
      assert.ok(true, 'listener called')
    })

    EventHandler.trigger(element, 'foobar')
  })

  QUnit.test('should trigger event through jQuery event system', function (assert) {
    assert.expect(1)

    var element = document.createElement('div')
    $(element).on('foobar', function () {
      assert.ok(true, 'listener called')
    })

    EventHandler.trigger(element, 'foobar')
  })

  QUnit.test('should trigger namespaced event through jQuery event system', function (assert) {
    assert.expect(2)

    var element = document.createElement('div')
    $(element).on('foobar.namespace', function () {
      assert.ok(true, 'first listener called')
    })
    element.addEventListener('foobar.namespace', function () {
      assert.ok(true, 'second listener called')
    })

    EventHandler.trigger(element, 'foobar.namespace')
  })

  QUnit.test('should mirror preventDefault', function (assert) {
    assert.expect(2)

    var element = document.createElement('div')
    $(element).on('foobar.namespace', function (event) {
      event.preventDefault()
      assert.ok(true, 'first listener called')
    })
    element.addEventListener('foobar.namespace', function (event) {
      assert.ok(event.defaultPrevented, 'defaultPrevented is true in second listener')
    })

    EventHandler.trigger(element, 'foobar.namespace')
  })

  QUnit.test('on should add event listener', function (assert) {
    assert.expect(1)

    var element = document.createElement('div')
    EventHandler.on(element, 'foobar', function () {
      assert.ok(true, 'listener called')
    })

    EventHandler.trigger(element, 'foobar')
  })

  QUnit.test('on should add namespaced event listener', function (assert) {
    assert.expect(1)

    var element = document.createElement('div')
    EventHandler.on(element, 'foobar.namespace', function () {
      assert.ok(true, 'listener called')
    })

    EventHandler.trigger(element, 'foobar.namespace')
  })

  QUnit.test('on should add native namespaced event listener', function (assert) {
    assert.expect(1)

    var element = document.createElement('div')
    EventHandler.on(element, 'click.namespace', function () {
      assert.ok(true, 'listener called')
    })

    EventHandler.trigger(element, 'click')
  })

  QUnit.test('on should add delegated event listener', function (assert) {
    assert.expect(1)

    var element = document.createElement('div')
    var subelement = document.createElement('span')
    element.appendChild(subelement)

    var anchor = document.createElement('a')
    element.appendChild(anchor)

    EventHandler.on(element, 'click.namespace', 'a', function () {
      assert.ok(true, 'listener called')
    })

    EventHandler.on(element, 'click', 'span', function () {
      assert.notOk(true, 'listener should not be called')
    })

    document.body.appendChild(element)
    EventHandler.trigger(anchor, 'click')
    document.body.removeChild(element)
  })

  QUnit.test('one should remove the listener after the event', function (assert) {
    assert.expect(1)

    var element = document.createElement('div')
    EventHandler.one(element, 'foobar', function () {
      assert.ok(true, 'listener called')
    })

    EventHandler.trigger(element, 'foobar')
    EventHandler.trigger(element, 'foobar')
  })

  QUnit.test('off should remove a listener', function (assert) {
    assert.expect(1)

    var element = document.createElement('div')
    var handler = function () {
      assert.ok(true, 'listener called')
    }

    EventHandler.on(element, 'foobar', handler)
    EventHandler.trigger(element, 'foobar')

    EventHandler.off(element, 'foobar', handler)
    EventHandler.trigger(element, 'foobar')
  })

  QUnit.test('off should remove all the listeners', function (assert) {
    assert.expect(2)

    var element = document.createElement('div')

    EventHandler.on(element, 'foobar', function () {
      assert.ok(true, 'first listener called')
    })
    EventHandler.on(element, 'foobar', function () {
      assert.ok(true, 'second listener called')
    })
    EventHandler.trigger(element, 'foobar')

    EventHandler.off(element, 'foobar')
    EventHandler.trigger(element, 'foobar')
  })

  QUnit.test('off should remove all the namespaced listeners if namespace is passed', function (assert) {
    assert.expect(2)

    var element = document.createElement('div')

    EventHandler.on(element, 'foobar.namespace', function () {
      assert.ok(true, 'first listener called')
    })
    EventHandler.on(element, 'foofoo.namespace', function () {
      assert.ok(true, 'second listener called')
    })
    EventHandler.trigger(element, 'foobar.namespace')
    EventHandler.trigger(element, 'foofoo.namespace')

    EventHandler.off(element, '.namespace')
    EventHandler.trigger(element, 'foobar.namespace')
    EventHandler.trigger(element, 'foofoo.namespace')
  })

  QUnit.test('off should remove the namespaced listeners', function (assert) {
    assert.expect(2)

    var element = document.createElement('div')

    EventHandler.on(element, 'foobar.namespace', function () {
      assert.ok(true, 'first listener called')
    })
    EventHandler.on(element, 'foofoo.namespace', function () {
      assert.ok(true, 'second listener called')
    })
    EventHandler.trigger(element, 'foobar.namespace')

    EventHandler.off(element, 'foobar.namespace')
    EventHandler.trigger(element, 'foobar.namespace')

    EventHandler.trigger(element, 'foofoo.namespace')
  })

  QUnit.test('off should remove the all the namespaced listeners for native events', function (assert) {
    assert.expect(2)

    var element = document.createElement('div')

    EventHandler.on(element, 'click.namespace', function () {
      assert.ok(true, 'first listener called')
    })
    EventHandler.on(element, 'click.namespace2', function () {
      assert.ok(true, 'second listener called')
    })
    EventHandler.trigger(element, 'click')

    EventHandler.off(element, 'click')
    EventHandler.trigger(element, 'click')
  })

  QUnit.test('off should remove the specified namespaced listeners for native events', function (assert) {
    assert.expect(3)

    var element = document.createElement('div')

    EventHandler.on(element, 'click.namespace', function () {
      assert.ok(true, 'first listener called')
    })
    EventHandler.on(element, 'click.namespace2', function () {
      assert.ok(true, 'second listener called')
    })
    EventHandler.trigger(element, 'click')

    EventHandler.off(element, 'click.namespace')
    EventHandler.trigger(element, 'click')
  })
})
