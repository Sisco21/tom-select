describe('Events', function() {

	describe('focus', function() {
		it_n('should work as expected', function(done) {
			var test = setup_test('<select><option value="a" selected></option><option value="b"></option><option value="c"></option></select>', {});
			var counter = 0;
			test.selectize.on('focus', function() { counter++; });
			test.selectize.focus();

			syn.click(test.selectize.$control).delay(0, function() {
				window.setTimeout(function() {
					expect(counter).to.be.equal(1);
					done();
				}, 0);
			});
		});
	});

	describe('blur', function() {
		it_n('should work as expected', function(done) {
			var test = setup_test('<select><option value="a" selected></option><option value="b"></option><option value="c"></option></select>', {});
			var counter = 0;
			test.selectize.on('blur', function() { counter++; });
			test.selectize.focus();

			syn.click(test.selectize.$control).delay(0, function() {
				syn.click($('body')).delay(0, function() {
					window.setTimeout(function() {
						expect(counter).to.be.equal(1);
						done();
					}, 0);
				});
			});
		});
	});

	describe('change', function() {
		it_n('should be triggered once', function(done) {
			var test = setup_test('<select><option value="a" selected></option><option value="b"></option><option value="c"></option></select>', {});
			var counter = 0;
			test.selectize.on('change', function() { counter++; });
			test.selectize.setValue('b');

			window.setTimeout(function() {
				expect(counter).to.be.equal(1);
				done();
			}, 0);
		});
		it_n('should contain current value', function(done) {
			var test = setup_test('<select><option value="a" selected></option><option value="b"></option><option value="c"></option></select>', {});
			test.selectize.on('change', function(value) {
				expect(value).to.be.equal('c');
				done();
			});
			test.selectize.setValue('c');
		});
		it_n('should not be triggered when the selected item has not changed', function(done) {
			var test = setup_test('<select><option value="a" selected="selected">a</option></select>');

			var counter = 0;
			test.$select.on('change', function() { counter++; });

			syn.click(test.selectize.$control).delay(0, function() {
				syn
					.click($('[data-value="a"]', $(test.selectize.dropdown)))
					.delay(0, function() {
						expect(counter).to.be.equal(0);
						done();
					});
			});
		});


		it_n('should not be possible to trigger a disabled option', function(done) {
			var test = setup_test(['<select>',
				'<option value="a" disabled>Item A</option>',
				'<option value="b">Item B</option>',
				'</select>'].join(''), {});
			var counter = 0;
			test.$select.on('change', function() { counter++; });

			syn.click(test.selectize.$control).delay(0, function() {
				syn
					.click($('[data-value="a"]', $(test.selectize.dropdown)))
					.delay(0, function() {
						expect(counter).to.be.equal(0);
						done();
					});
			});
		});

		it_n('should not be possible to trigger a option under a disabled optgroup', function(done) {
			var test = setup_test(['<select>',
				'<optgroup label="Group 1">',
				'<option value="a">Item A</option>',
				'</optgroup>',
				'<optgroup label="Group 2" disabled>',
				'<option value="b">Item B</option>',
				'<option value="c">Item C</option>',
				'</optgroup>',
				'</select>'].join(''), {});
			var counter = 0;
			test.$select.on('change', function() { counter++; });

			syn.click(test.selectize.$control).delay(0, function() {
				syn
					.click($('[data-value="c"]', $(test.selectize.dropdown)))
					.delay(0, function() {
						expect(counter).to.be.equal(0);
						done();
					});
			});
		});
	});

	describe('item_add', function() {
		it_n('should be triggered', function(done) {
			var test = setup_test('<select><option value="a"></option><option value="b"></option><option value="c"></option></select>', {});
			test.selectize.on('item_add', function() {
				done();
			});
			test.selectize.addItem('b');
		});
		it_n('should contain item\'s value and element', function(done) {
			var test = setup_test('<select><option value="a"></option><option value="b"></option><option value="c"></option></select>', {});
			test.selectize.on('item_add', function(value, $item) {
				expect(value).to.be.equal('b');
				assert.equal($item.length, 1);
				done();
			});
			test.selectize.addItem('b');
		});
	});

	describe('item_remove', function() {
		it_n('should be triggered', function(done) {
			var test = setup_test('<select multiple><option value="a" selected></option><option value="b" selected></option><option value="c"></option></select>', {});
			test.selectize.on('item_remove', function() {
				done();
			});
			test.selectize.removeItem('a');
		});
		it_n('should contain item\'s value and element', function(done) {
			var test = setup_test('<select multiple><option value="a" selected></option><option value="b" selected></option><option value="c"></option></select>', {});
			test.selectize.on('item_remove', function(value, item) {
				expect(value).to.be.equal('b');
				expect(item.dataset.value).to.be.equal('b');
				done();
			});
			test.selectize.removeItem('b');
		});
	});

	describe('clear', function() {
		it_n('should be triggered', function(done) {
			var test = setup_test('<select><option value="a" selected></option><option value="b" selected></option><option value="c"></option></select>', {});
			test.selectize.on('clear', function() {
				done();
			});
			test.selectize.clear();
		});
	});

	describe('optgroup_add', function() {
		it_n('should be triggered', function(done) {
			var test = setup_test('<select><option value="a" selected></option><option value="b" selected></option><option value="c"></option></select>', {});
			test.selectize.on('optgroup_add', function() { done(); });
			test.selectize.addOptionGroup('id', {label: 'Group'});
		});
		it_n('should contain optgroup id', function(done) {
			var test = setup_test('<select><option value="a" selected></option><option value="b" selected></option><option value="c"></option></select>', {});
			test.selectize.on('optgroup_add', function(id, data) {
				expect(id).to.be.equal('id');
				done();
			});
			test.selectize.addOptionGroup('id', {label: 'Group'});
		});
		it_n('should contain outgroup data', function(done) {
			var test = setup_test('<select><option value="a" selected></option><option value="b" selected></option><option value="c"></option></select>', {});
			var optgroup = {label: 'Group'};
			test.selectize.on('optgroup_add', function(id, data) {
				expect(data).to.eql(optgroup);
				done();
			});
			test.selectize.addOptionGroup('id', optgroup);
		});
	});

	describe('optgroup_remove', function() {
		it_n('should be triggered', function(done) {
			var test = setup_test('<select><option value="a" selected></option><option value="b" selected></option><option value="c"></option></select>', {});
			test.selectize.on('optgroup_remove', function(id) {
				expect(id).to.be.equal('id');
				done();
			});
			test.selectize.addOptionGroup('id', {label: 'Group'});
			test.selectize.removeOptionGroup('id');
		});
	});

	describe('optgroup_clear', function() {
		it_n('should be triggered', function(done) {
			var test = setup_test('<select><option value="a" selected></option><option value="b" selected></option><option value="c"></option></select>', {});
			test.selectize.on('optgroup_clear', function() {
				done();
			});
			test.selectize.addOptionGroup('id', {label: 'Group'});
			test.selectize.clearOptionGroups();
		});
	});

	describe('option_add', function() {
		it_n('should be triggered', function(done) {
			var test = setup_test('<select><option value="a" selected></option><option value="b" selected></option><option value="c"></option></select>', {});
			test.selectize.on('option_add', function() {
				done();
			});
			test.selectize.addOption({value: 'e'});
		});
		it_n('should contain option value', function(done) {
			var test = setup_test('<select><option value="a" selected></option><option value="b" selected></option><option value="c"></option></select>', {});
			test.selectize.on('option_add', function(value, data) {
				expect(value).to.be.equal('e');
				done();
			});
			test.selectize.addOption({value: 'e'});
		});
		it_n('should contain option data', function(done) {
			var test = setup_test('<select><option value="a" selected></option><option value="b" selected></option><option value="c"></option></select>', {});
			var option = {value: 'e'};
			test.selectize.on('option_add', function(value, data) {
				expect(option).to.eql(data);
				done();
			});
			test.selectize.addOption(option);
		});
	});

	describe('option_remove', function() {
		it_n('should be triggered', function(done) {
			var test = setup_test('<select><option value="a" selected></option><option value="b" selected></option><option value="c"></option></select>', {});
			test.selectize.on('option_remove', function() {
				done();
			});
			test.selectize.removeOption('a');
		});
		it_n('should contain option value', function(done) {
			var test = setup_test('<select><option value="a" selected></option><option value="b" selected></option><option value="c"></option></select>', {});
			test.selectize.on('option_remove', function(value) {
				expect(value).to.be.equal('a');
				done();
			});
			test.selectize.removeOption('a');
		});
	});

	describe('option_clear', function() {
		it_n('should be triggered', function(done) {
			var test = setup_test('<select><option value="a" selected></option><option value="b" selected></option><option value="c"></option></select>', {});
			test.selectize.on('option_clear', function() {
				done();
			});
			test.selectize.clearOptions();
		});
	});

	describe('dropdown_open', function() {
		it_n('should be triggered', function(done) {
			var test = setup_test('<select><option value="a" selected></option><option value="b" selected></option><option value="c"></option></select>', {});
			test.selectize.on('dropdown_open', function() {
				done();
			});
			test.selectize.open();
		});
	});

	describe('dropdown_close', function() {
		it_n('should be triggered', function(done) {
			var test = setup_test('<select><option value="a" selected></option><option value="b" selected></option><option value="c"></option></select>', {});
			test.selectize.on('dropdown_close', function() {
				done();
			});
			test.selectize.open();
			test.selectize.close();
		});
	});

	describe('destroy', function() {
		it_n('should be triggered', function(done) {
			var test = setup_test('<select><option value="a" selected></option><option value="b" selected></option><option value="c"></option></select>', {});
			test.selectize.on('destroy', function() {
				done();
			});
			test.selectize.destroy();
		});
	});

	describe('type', function() {
		it_n('should be triggered', function(done) {
			var test = setup_test('<select></select>', {create: true});
			test.selectize.on('type', function() {
				done();
			});
			syn.click(test.selectize.$control).type('a', $(test.selectize.control_input));
		});
		it_n('should contain current value', function(done) {
			var test = setup_test('<select></select>', {create: true});
			test.selectize.on('type', function(value) {
				expect(value).to.be.equal('a');
				done();
			});
			syn.click(test.selectize.$control).type('a', $(test.selectize.control_input));
		});
	});

});
