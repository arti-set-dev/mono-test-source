export const lazyLoadFunc = (triggerElems, threshold = 0.5, isUnobserve = false, callback) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        triggerElems.forEach(elem => {
          callback();
        });

        if (isUnobserve) {
          observer.unobserve(entry.target)
        }
      }
    });
  }, {
    threshold: threshold
  });

  triggerElems.forEach(elem => { observer.observe(elem)} );
}
