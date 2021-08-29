import { orderBy, reduce } from "lodash"
import { action, computed, makeObservable, observable } from "mobx"
import { CanarySorter } from "./data"
import { filterChecks, isHealthy, labelIndex } from "./filter"
import { getGroupedChecks, getGroupSelections, NO_GROUP } from "./grouping"
import { getLabels } from "./labels"

export default class CanaryStore {
  checks = []
  selectedLabels = []
  url = ""
  filters = []
  groupBy = NO_GROUP
  hidePassing = true
  lastFetched = null
  error = null

  constructor(url) {
    makeObservable(this, {
      checks: observable,
      lastFetched: observable,
      selectedLabels: observable,
      groupBy: observable,
      filters: observable,
      hidePassing: observable,
      lastFetched: observable,
      error: observable,
      groupSelections: computed,
      labels: computed,
      passed: computed,
      failed: computed,
      filtered: computed,
      // groups: computed,
      toggleLabel: action,
      togglePassing: action,
      setGroupBy: action
    })
    this.url = url
    this.hidePassing = true
  }

  load() {
    fetch(this.url)
      .then((result) => result.json())
      .then(
        action("fetchSuccess", (checks) => {
          this.checks = checks.checks
          // let checks = await result.json();
          // this.checks = checks
          this.lastFetched = new Date();
          console.log("fetched", checks, this.passed)
        }),
        action("fetchFailure", (e) =>
          this.error = e))
  }

  togglePassing() {
    this.hidePassing = !this.hidePassing
  }

  setGroupBy(group) {
    this.groupBy = group
  }

  toggleLabel(label) {
    const index = labelIndex(this.selectedLabels, label);
    if (index >= 0) {
      this.selectedLabels.filter((i) => i.id !== label.id);
    }
    this.selectedLabels.push(label);
  }

  get passedAll() {
    return reduce(this.checks, (sum, c) => (isHealthy(c) ? sum + 1 : sum), 0);
  }

  get failed() {
    return this.filtered.length = this.passed
  }

  get passed() {
    return reduce(this.filtered, (sum, c) => (isHealthy(c) ? sum + 1 : sum), 0);
  }

  get failedAll() {
    return this.checks.length - this.passedAll
  }

  get labels() {
    return getLabels(this.checks, this.hidePassing, []);
  }

  get groupSelections() {
    return getGroupSelections(this.checks);
  }

  get hasGrouping() {
    return this.groupBy.name != NO_GROUP.name
  }

  get groupedChecks() {
    return getGroupedChecks(this.filtered, this.groupBy);
  }

  get filtered() {
    console.log(this.checks, this.hidePassing)
    let checks = filterChecks(this.checks, this.hidePassing, this.filters);
    // return orderBy(checks, CanarySorter);
    return this.checks
  }

}
