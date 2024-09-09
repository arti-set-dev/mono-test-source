import { validateForms } from "../functions/validate-forms.js";

const checks = [
  {
    selector: "[data-checkbox-group]",
    errorMessage: "",
  }
];

const contactsRules = [
  {
    ruleSelector: '[data-name]',
    rules: [
      {
        rule: 'required',
        value: true,
        errorMessage: 'Является обязательным полем'
      }
    ]
  },
  {
    ruleSelector: '[data-tel]',
    tel: true,
    telError: 'Введите корректный телефон',
    rules: [
      {
        rule: 'required',
        value: true,
        errorMessage: 'Является обязательным полем'
      }
    ]
  },
];

const afterForm = () => {
  console.log('Произошла отправка');
};

validateForms('[data-contacts-form]', contactsRules, checks, afterForm)
