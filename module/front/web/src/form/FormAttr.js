/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.FormAttr = class FormAttr extends Front.Element {

    init () {
        this.$value = this.find('[name]');
        this.form = this.getClosestHandler(Front.Form);
        this.name = this.$value.attr('name');
    }

    addError (message) {
        this.form.addError(this.name, message);
    }

    validate () {
        for (const config of this.getValidators()) {
            if (!(new config.Class(config)).validate(this.getValue(), this)) {
                break;
            }
        }
    }

    getValidators () {
        return [];
    }

    getNormalizedValue () {
        return this.getValue();
    }

    getValue () {
        return this.$value.val();
    }

    setValue (value) {
        return this.$value.val(value);
    }
};

Front.FormBoolean = class FormBoolean extends Front.FormAttr {

    init () {
        super.init();
        this.$checkbox = this.find('[type="checkbox"]');
        this.$checkbox.prop('checked', this.$value.val() === 'true');
        this.$checkbox.change(this.onChangeCheckbox.bind(this));
    }

    onChangeCheckbox () {
        this.$value.val(this.$checkbox.is(':checked'));
    }
};

Front.FormDate = class FormDate extends Front.FormAttr {

    init () {
        super.init();
        const options = {};
        options.defaultDate = this.getDefaultDate(this.$value.val());
        options.format = Jam.DateHelper.getMomentFormat('date');
        this.$picker = this.find('.datepicker');
        this.$picker.datetimepicker({...$.fn.datetimepicker.defaultOptions, ...options});
        this.picker = this.$picker.data('DateTimePicker');
        this.$picker.on('dp.change', this.onChangeDate.bind(this));
    }

    getDefaultDate (value) {
        return !value ? null : this.utc ? new Date(value.slice(0, -1)) : new Date(value);
    }

    onChangeDate (event) {
        const date = event.date;
        const format = this.picker.options().format;
        const value = date ? moment(moment(date).format(format), format) : '';
        this.$value.val(value ? Jam.DateHelper.stringify(value, this.utc) : '');
        if (!date) {
            this.picker.hide();
        }
    }
};

Front.FormNumber = class FormNumber extends Front.FormAttr {

    getNormalizedValue () {
        const value = this.getValue();
        return typeof value === 'string' ? parseFloat(value) : value;
    }

    getValidators () {
        const data = this.$value.data();
        return [{
            Class: Front.NumberValidator,
            max: data.max,
            min: data.min,
            integerOnly: data.integerOnly
        }];
    }
};

Front.FormSelect = class FormSelect extends Front.Element {
};

Front.FormNetworkName = class FormNetworkName extends Front.FormAttr {

    getValidators () {
        return [{
            Class: Front.RegexValidator,
            pattern: /^[a-z0-9\- ]{1,32}$/i
        }];
    }
};

Front.FormNetworkSelect = class FormNetworkSelect extends Front.FormAttr {

    init () {
        super.init();
        this.storage = this.form.front[this.getData('storage')];
        this.storage.on('change', this.onChangeStorage.bind(this));
        this.onChangeStorage();
    }

    onChangeStorage () {
        $.when(this.storage.list()).then(items => {
            const value = this.getValue();
            this.$value.html(this.build(items, value));
            if (this.getValue() !== value) {
                this.$value.change();
            }
        });
    }

    build (items, selection) {
        const result = ['<option></option>'];
        for (const item of items) {
            const selected = selection ? selection === item.id : item.selected;
            result.push(`<option ${selected ? 'selected' : ''} value="${item.id}">${item.name}</option>`);
        }
        return result.join('');
    }
};