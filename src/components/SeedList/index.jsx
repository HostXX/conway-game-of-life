import React from 'react'


const SeedList = React.memo(({ savedSeeds }) => {
//   console.log('render')
//   console.log(savedSeeds)

  return (
      <div >
    <div style={{margin:'0 auto'}} className={'thumb-container'}>
      {savedSeeds &&
        savedSeeds.map((grid,idx) => {
          return (
            <div
            key={`grid-${idx}`}
              style={{
                margin : '15px',
                float:'left',
                display: 'grid',
                gridTemplateColumns: `repeat(${grid.length},4px)`,
              }}
            >
              {grid.map((rows, i) =>
                rows.map((col, k) => (
                  <div
                    key={`${i}-${k}`}
                    style={{
                      width: 2,
                      height: 2,
                      backgroundColor: grid[i][k] ? 'black' : undefined,
                      border: 'solid 1px black'
                    }}
                  ></div>
                ))
              )}
              <br/>
            </div>
           
          )
        })}
    </div>
    </div>
  )
})

export default SeedList
