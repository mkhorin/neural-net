/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.Form = class Form extends Front.Element {

    init () {
        this.$topError = this.find('.form-error');
        this.on('form:clear', this.onClear.bind(this));
        this.initDefaultValues();
    }

    initDefaultValues () {
        this.defaults = {};
        this.forEachAttr(($attr, $value, name) => this.defaults[name] = $value.val());
    }

    setDefaultValues () {
        this.forEachAttr(($attr, $value, name) => $value.val(this.defaults[name] || ''));
    }

    onClear () {
        this.find('[name]').val('');
    }

    hasAttr (name) {
        return this.getValueElement(name).length > 0;
    }

    getAttr (name) {
        return this.getAttrByElement(this.getValueElement(name));
    }

    getAttrByElement (element) {
        return this.find(element).closest('.form-attr');
    }

    getAttrHandler (name) {
        return this.getAttr(name).data('handler');
    }

    getNormalizedValue (name) {
        const handler = this.getAttrHandler(name);
        return handler
            ? handler.getNormalizedValue()
            : this.getValueElement(name).val();
    }

    getValue (name) {
        const handler = this.getAttrHandler(name);
        return handler
            ? handler.getValue()
            : this.getValueElement(name).val();
    }

    setValue (name, value) {
        return this.getValueElement(name).val(value);
    }

    getValueElement (name) {
        return this.find(`[name="${name}"]`);
    }

    hasError () {
        return this.find('.has-error').length > 0;
    }

    addTopError (message) {
        this.$topError.html(message).addClass('has-error');
    }

    addErrors (data) {
        if (!data) {
            return false;
        }
        const topErrors = [];
        for (const name of Object.keys(data)) {
            this.getAttr(name).length
                ? this.addError(name, data[name])
                : topErrors.push(data[name]);
        }
        if (topErrors.length) {
            this.addTopError(topErrors.join('<br>'));
        }
    }

    addError (name, message) {
        const $attr = this.getAttr(name);
        $attr.addClass('has-error').find('.error-block').html(Jam.t(message));
        $attr.parents('.form-set').addClass('has-group-error');
    }

    clearErrors () {
        this.find('.has-error').removeClass('has-error');
        this.find('.has-group-error').removeClass('has-group-error');
    }

    setErrors (data) {
        data = Jam.Helper.parseJson(data);
        if (data) {
            for (const key of Object.keys(data)) {
                this.addError(key, data[key]);
            }
        }
    }

    serialize () {
        const result = {};
        this.forEachAttr(($attr, $value, name) => result[name] = this.getNormalizedValue(name));
        return result;
    }

    focus (name) {
        this.getValueElement(name).focus();
    }

    reset () {
        this.clearErrors();
        this.setDefaultValues();
    }

    validate () {
        this.clearErrors();
        this.forEachAttr(this.validateAttr, this);
        this.getValidators().forEach(config => new config.Class(config).validate(this));
        return !this.find('.has-error').length;
    }

    validateAttr ($attr, $value, name) {
        if ($attr.hasClass('required') && !$value.val()) {
            return this.addError(name, 'Value cannot be blank');
        }
        this.getAttrHandler(name)?.validate();
    }

    getValidators () {
        return [];
    }

    forEachAttr (handler, context) {
        for (const item of this.find('[name]')) {
            handler.call(context, this.getAttrByElement(item), $(item), item.name);
        }
    }

    toggleDisabled (state) {
        this.$container.attr('disabled', state);
    }
};