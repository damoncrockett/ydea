import React, { Component } from 'react';
import { select } from 'd3-selection';

const margin = {
  top: 100,
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
      plotH: 0,
      buttonIdx: null,
      filteredData: null,
      slicedCoords: null
    }

    this.drawSVG = this.drawSVG.bind(this);
    this.filterByButton = this.filterByButton.bind(this);
    this.handlePlotH = this.handlePlotH.bind(this);
    this.drawImages = this.drawImages.bind(this);
    this.filterByClick = this.filterByClick.bind(this);
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

    if (prevState.filteredData !== this.state.filteredData) {
      this.drawImages();
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

  filterByButton(e, d) {

    if ( this.state.buttonIdx!==null ) {
      select('#t' + this.state.buttonIdx + '_button')
        .style('color', '#424242')
        .style('background-color', 'rgba(242,241,239,0.67)')
    }

    select('#t' + d.idx + '_button')
      .style('background-color', '#424242')
      .style('color', 'rgba(242,241,239,0.67)')

    this.setState({ buttonIdx: d.idx })

    const filteredData = this.props.data.filter(item => item[d.col]===d.val);
    const n = filteredData.length;
    this.handlePlotH(n);
    const slicedCoords = this.props.coords.slice(0,n);

    this.setState({
      filteredData: filteredData,
      slicedCoords: slicedCoords
    });


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
      .attr('id', d => 't' + d.idx + '_button')
      .text(d => d.buttonlabel)
      .on('click', this.filterByButton )

      }

  drawImages() {
    const svgNode = this.svgNode.current;

    window.scrollTo(0,0);

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('image')
      .remove()

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('image')
      .data(this.state.slicedCoords)
      .enter()
      .append('image')
      .attr('x', d => d.x * (rectSide + pad) )
      .attr('y', d => d.y * (rectSide + pad) )

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('image')
      .data(this.state.filteredData)
      .attr('id', d => 't' + d.id + '_img')
      //.attr('xlink:href', d => "http://localhost:8888/" + d.imgpath )
      .attr('xlink:href', d => d.imgpath )
      .attr('width', rectSide )
      .attr('height', rectSide )
      .on('mouseover', function(e, d) {
        select(this).attr('width', rectSide * 1.1 );
        select(this).attr('height', rectSide * 1.1 );
        select('div.infoBox')
          .append('p')
          .attr('id', 'infoBox')
          .text(d.id + ': ' + d.name)
      })
      .on('mouseout', function() {
        select(this).attr('width', rectSide );
        select(this).attr('height', rectSide );
        select('#infoBox').remove()
      })
      .on('click', this.filterByClick )
    }

  filterByClick(e, d) {
    if ( this.props.nnToggle===false ) {

      window.open(d.link,'_blank')

    } else {

      select('#infoBox').remove()

      const nnIdxs = this.props.nn[d.id];
      // this ensures the items are still ordered by distance
      const filteredData = nnIdxs.map(item => this.props.data.filter(obj => obj['id']===item)[0]);

      const n = filteredData.length;
      this.handlePlotH(n);

      const slicedCoords = this.props.coords.slice(0,n);

      this.setState({
        filteredData: filteredData,
        slicedCoords: slicedCoords
      });

    }
  }

  render() {
    return (
      <div>
        <div className='scrollBox'>
          <div className='navPanel'>
          </div>
        </div>
        <div className='infoBox'>
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
