import CollapsiblePanel from "../CollapsiblePanel";
import SlidingSideBar from "./index";

const data = Array.from(Array(100).keys());

export default {};

const Template = () => (
  <SlidingSideBar>
    <CollapsiblePanel Header={<div>First Panel</div>}>
      {data.map((item) => {
        return <div key={item}>{item}</div>;
      })}
    </CollapsiblePanel>
    <CollapsiblePanel Header={<div>Second Panel</div>}>
      {data.map((item) => {
        return <div key={item}>{item}</div>;
      })}
    </CollapsiblePanel>
    <CollapsiblePanel Header={<div>Third Panel</div>}>
      {data.map((item) => {
        return <div key={item}>{item}</div>;
      })}
    </CollapsiblePanel>
  </SlidingSideBar>
);

export const EqualAutoHeight = Template.bind({});

const RatioBasedHeightTemplate = () => (
  <SlidingSideBar>
    <CollapsiblePanel
      Header={<div>First Panel</div>}
      data-panel-height-ratio="0.5"
    >
      {data.map((item) => {
        return <div key={item}>{item}</div>;
      })}
    </CollapsiblePanel>
    <CollapsiblePanel
      Header={<div>Second Panel</div>}
      data-panel-height-ratio="0.75"
    >
      {data.map((item) => {
        return <div key={item}>{item}</div>;
      })}
    </CollapsiblePanel>
    <CollapsiblePanel
      Header={<div>Third Panel</div>}
      data-panel-height-ratio="1.75"
    >
      {data.map((item) => {
        return <div key={item}>{item}</div>;
      })}
    </CollapsiblePanel>
  </SlidingSideBar>
);

export const RatioBasedHeight = RatioBasedHeightTemplate.bind({});

const FixedAndAutoHeightTemplate = () => (
  <SlidingSideBar>
    <CollapsiblePanel Header={<div>First Panel</div>} data-panel-height="150px">
      {data.map((item) => {
        return <div key={item}>{item}</div>;
      })}
    </CollapsiblePanel>
    <CollapsiblePanel
      Header={<div>Second Panel</div>}
      data-panel-height-ratio="0.75"
    >
      {data.map((item) => {
        return <div key={item}>{item}</div>;
      })}
    </CollapsiblePanel>
    <CollapsiblePanel
      Header={<div>Third Panel</div>}
      data-panel-height-ratio="1.25"
    >
      {data.map((item) => {
        return <div key={item}>{item}</div>;
      })}
    </CollapsiblePanel>
  </SlidingSideBar>
);

export const FixedAndAutoHeight = FixedAndAutoHeightTemplate.bind({});
