// Original Khmer One H5P content type. MIT; see LICENSE in this folder.
(function (H5P) {
  function Evidence(params, id) {
    H5P.EventDispatcher.call(this);
    this.score = 0;
    // An arrow function keeps the content instance as `this` in event handlers.
    this.attach = (container) => {
      const host = container[0];
      host.classList.add('ko-evidence');
      const plain = value => {
        const element = document.createElement('div');
        element.innerHTML = String(value || '');
        return element.textContent || '';
      };
      const fieldset = document.createElement('fieldset');
      const legend = document.createElement('legend');
      legend.textContent = plain(params.question);
      fieldset.append(legend);
      const radios = [];
      (params.answers || []).forEach((answer, index) => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        const text = document.createElement('span');
        input.type = 'radio';
        input.name = 'ko-evidence-' + id;
        input.value = index;
        radios.push(input);
        text.textContent = plain(answer.text);
        label.append(input, text);
        fieldset.append(label);
      });
      const feedback = document.createElement('div');
      feedback.className = 'ko-feedback';
      feedback.setAttribute('role', 'status');
      const actions = document.createElement('div');
      actions.className = 'ko-actions';
      const check = document.createElement('button');
      check.type = 'button';
      check.textContent = params.UI.checkAnswerButton;
      check.onclick = () => {
        const index = radios.findIndex(radio => radio.checked);
        if (index < 0) {
          feedback.textContent = params.UI.noInput;
          this.trigger('resize');
          return;
        }
        const answer = params.answers[index];
        this.score = answer.correct ? 1 : 0;
        feedback.textContent = (answer.correct ? params.UI.correctAnswer : params.UI.wrongAnswer) + '. ' + plain(answer.tipsAndFeedback?.chosenFeedback);
        this.trigger('resize');
      };
      const retry = document.createElement('button');
      retry.type = 'button';
      retry.textContent = params.UI.tryAgainButton;
      retry.onclick = () => {
        radios.forEach(radio => { radio.checked = false; });
        this.score = 0;
        feedback.textContent = '';
        this.trigger('resize');
      };
      actions.append(check, retry);
      host.append(fieldset, actions, feedback);
      this.trigger('resize');
    };
    this.getScore = () => this.score;
    this.getMaxScore = () => 1;
    this.getCurrentState = () => ({score:this.score});
  }
  Evidence.prototype = Object.create(H5P.EventDispatcher.prototype);
  Evidence.prototype.constructor = Evidence;
  H5P.KhmerOneEvidence = Evidence;
})(H5P);
