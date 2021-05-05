import React, { Component } from 'react';
import { select } from 'd3-selection';

const margin = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
};

const innerW = window.innerWidth
console.log(window.innerWidth);

const pad = innerW * 0.0067;
const ncols = 5;
const rectSide = innerW * 0.75 / ncols - pad;
const plotW = (rectSide + pad) * ncols;

class Field extends Component {
  constructor(props) {
    super(props);

    this.state = {
      plotH: 0
    }

    this.drawSVG = this.drawSVG.bind(this);
    this.filterData = this.filterData.bind(this);
    this.handlePlotH = this.handlePlotH.bind(this);
    this.drawImages = this.drawImages.bind(this);
    this.drawNav = this.drawNav.bind(this);
    this.svgNode = React.createRef();
  }

  componentDidMount() {
    this.drawSVG();
  }

  componentDidUpdate(prevProps, prevState) {
    // conditional prevents infinite loop
    if (prevProps.data === null && prevProps.data !== this.props.data) {
      this.drawNav();
    }
  }

  drawSVG() {
    const svgNode = this.svgNode.current;

    select(svgNode)
      .selectAll('g.plotCanvas')
      .data([0]) // bc enter selection, prevents appending new 'g' on re-render
      .enter()
      .append('g')
      .attr('class', 'plotCanvas') // purely semantic
      .attr('transform', `translate(${margin.left},${margin.top})`);

    }

  filterData(e, d) {
    const filteredData = this.props.data.filter(item => item[d.col]===d.val);
    const n = filteredData.length;
    const slicedCoords = this.props.coords.slice(0,n);

    this.handlePlotH(n);
    this.drawImages(filteredData,slicedCoords);

  }

  handlePlotH(n) {
    const nrows = Math.ceil( n / ncols )
    const plotH = (rectSide + pad) * nrows;

    this.setState({ plotH: plotH});
  }

  drawNav() {

    // drawing the mentions themselves
    select('div.navPanel')
      .selectAll('p')
      .data(this.props.nav)
      .enter()
      .append('p')
      .text(d => d.buttonlabel)
      .on('click', this.filterData )

      }

  drawImages(filteredData,slicedCoords) {
    const svgNode = this.svgNode.current;

    window.scrollTo(0,0);

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('image')
      .remove()

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('image')
      .data(filteredData)
      .enter()
      .append('image')
      .attr('id', d => 't' + d.id + '_img')
      //.attr('xlink:href', d => "http://localhost:8888/" + d.imgpath )
      .attr('xlink:href', d => d.imgpath )
      .attr('width', rectSide )
      .attr('height', rectSide )

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('image')
      .data(slicedCoords)
      .attr('x', d => d.x * (rectSide + pad) )
      .attr('y', d => d.y * (rectSide + pad) )

    }

  render() {
    return (
      <div>
        <div className='scrollBox'>
          <div className='navPanel'>
          </div>
        </div>
        <div className='iconPanel'>
          <svg
          ref={this.svgNode}
          width={plotW}
          height={this.state.plotH}
          />
        </div>
      </div>
    );
  }
}

export default Field;
