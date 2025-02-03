import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
  } from "@material-tailwind/react";
  
  export default function TabsCustomAnimation() {
    const data = [
      {
        label: "HTML",
        value: "html",
      },
      {
        label: "React",
        value: "react",
      },
      {
        label: "Vue",
        value: "vue",
      },
      {
        label: "Angular",
        value: "angular",
      },
      {
        label: "Svelte",
        value: "svelte",
      },
    ];
  
    return (
      <Tabs id="custom-animation" value="html">
        <TabsHeader>
          {data.map(({ label, value }) => (
            <Tab
              key={value}
              value={value}
              className={`py-2 px-4 text-center transition-all duration-300 ${
                value === 'html'  // Check for the active value directly
                  ? 'bg-gray-300 border-l-2 border-r-2 border-gray-500'
                  : 'bg-transparent'
              }`}
            >
              {label}
            </Tab>
          ))}
        </TabsHeader>
      </Tabs>
    );
  }
  