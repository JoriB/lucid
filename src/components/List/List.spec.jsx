import _ from 'lodash';
import React from 'react';
import assert from 'assert';
import { shallow, mount } from 'enzyme';
import { common } from '../../util/generic-tests';
import describeWithDOM from '../../util/describe-with-dom';
import List from './List';
import sinon from 'sinon';

describe('List', () => {
	common(List);

	it('should have the correct number of children', () => {
		const wrapper = shallow(
			<List>
				<List.Item />
				<List.Item />
				<List.Item />
			</List>
		);

		assert.equal(wrapper.find('.lucid-List-Item').length, 3);
	});

	it('should render the Item content correctly', () => {
		const wrapper = shallow(
			<List>
				<List.Item>blarg</List.Item>
			</List>
		);

		assert.equal(wrapper.find('.lucid-List-Item').text(), 'blarg');
	});

	it('should correctly recognize other List\'s as children', () => {
		const wrapper = shallow(
			<List>
				<List.Item>
					<div>Other random content</div>
					<List>
						<List.Item />
					</List>
				</List.Item>
			</List>
		);

		assert.equal(wrapper.find('.lucid-List-Item-is-parent').length, 1);
	});

	it('should favor child props over parent level indicies', () => {
		const wrapper = shallow(
			<List selectedIndices={[0]} expandedIndices={[2]}>
				<List.Item>
					Selected one
				</List.Item>

				<List.Item isSelected={true}>
					Selected two
				</List.Item>

				<List.Item>
					Expanded one
				</List.Item>

				<List.Item isExpanded={true}>
					Expanded two
				</List.Item>
			</List>
		);

		assert.equal(wrapper.find('.lucid-List-Item-is-selected').length, 2);
		assert.equal(wrapper.find('.lucid-List-Item-is-expanded').length, 2);
	});

	it('should fire onSelect', () => {
		const onSelect = sinon.spy();
		const wrapper = shallow(
			<List onSelect={onSelect}>
				<List.Item>One</List.Item>
				<List.Item>Two</List.Item>
			</List>
		);

		wrapper.find('.lucid-List-Item-content').at(1).simulate('click');

		assert(onSelect.called);
		assert.equal(onSelect.args[0][0], 1, 'wrong index on the onSelect callback');
		assert(_.has(onSelect.args[0][1], 'event'), 'missing `event` on the onSelect callback');
		assert(_.has(onSelect.args[0][1], 'props'), 'missing `props` on the onSelect callback');
	});

	it('should fire onSelect on the child', () => {
		const onSelect = sinon.spy();
		const wrapper = shallow(
			<List>
				<List.Item>One</List.Item>
				<List.Item onSelect={onSelect}>Two</List.Item>
			</List>
		);

		wrapper.find('.lucid-List-Item-content').at(1).simulate('click');

		assert(onSelect.called);
		assert.equal(onSelect.args[0][0], 1, 'wrong index on the onSelect callback');
		assert(_.has(onSelect.args[0][1], 'event'), 'missing `event` on the onSelect callback');
		assert(_.has(onSelect.args[0][1], 'props'), 'missing `props` on the onSelect callback');
	});

	it('should not fire onSelect when isDisabled on the parent', () => {
		const onSelect = sinon.spy();
		const wrapper = shallow(
			<List onSelect={onSelect} isDisabled={true}>
				<List.Item>One</List.Item>
				<List.Item>Two</List.Item>
			</List>
		);

		wrapper.find('.lucid-List-Item-content').at(1).simulate('click');

		assert(!onSelect.called);
	});

	it('should not fire onSelect when isDisabled on the child', () => {
		const onSelect = sinon.spy();
		const wrapper = shallow(
			<List onSelect={onSelect}>
				<List.Item>One</List.Item>
				<List.Item isDisabled={true}>Two</List.Item>
			</List>
		);

		wrapper.find('.lucid-List-Item-content').at(1).simulate('click');

		assert(!onSelect.called);
	});

	it('should show expanders based on hasExpander', () => {

		const wrapper = shallow(
			<List>
				<List.Item />
				<List.Item hasExpander={true} />
				<List.Item hasExpander={true} />
			</List>
		);

		assert.equal(wrapper.find('.lucid-List-expander').length, 2);
	});
});

describeWithDOM('List', () => {
	// Since onExpand uses a Button under the hood, we need to do a `mount` test
	// to make sure it's passing the `event` object around correctly
	it('should fire onExpand', () => {
		const onExpand = sinon.spy();
		const wrapper = mount(
			<List onExpand={onExpand}>
				<List.Item hasExpander={true} />
				<List.Item hasExpander={true} />
			</List>
		);

		wrapper.find('.lucid-List-expander').at(0).simulate('click');

		assert(onExpand.called);
		assert.equal(onExpand.args[0][0], 0, 'wrong index on the onExpand callback');
		assert(_.has(onExpand.args[0][1], 'event'), 'missing `event` on the onExpand callback');
		assert(_.has(onExpand.args[0][1], 'props'), 'missing `props` on the onExpand callback');
	});

	it('should fire onExpand on the child', () => {
		const onExpand = sinon.spy();
		const wrapper = mount(
			<List>
				<List.Item hasExpander={true} onExpand={onExpand} />
				<List.Item hasExpander={true} />
			</List>
		);

		wrapper.find('.lucid-List-expander').at(0).simulate('click');

		assert(onExpand.called);
		assert.equal(onExpand.args[0][0], 0, 'wrong index on the onExpand callback');
		assert(_.has(onExpand.args[0][1], 'event'), 'missing `event` on the onExpand callback');
		assert(_.has(onExpand.args[0][1], 'props'), 'missing `props` on the onExpand callback');
	});

	it('should not fire onExpand when isDisabled on the parent', () => {
		const onExpand = sinon.spy();
		const wrapper = mount(
			<List onExpand={onExpand} isDisabled={true}>
				<List.Item hasExpander={true} />
				<List.Item hasExpander={true} />
			</List>
		);

		wrapper.find('.lucid-List-expander').at(0).simulate('click');

		assert(!onExpand.called);
	});

	it('should not fire onExpand when isDisabled on the child', () => {
		const onExpand = sinon.spy();
		const wrapper = mount(
			<List onExpand={onExpand}>
				<List.Item hasExpander={true} isDisabled={true} />
				<List.Item hasExpander={true} />
			</List>
		);

		wrapper.find('.lucid-List-expander').at(0).simulate('click');

		assert(!onExpand.called);
	});

});