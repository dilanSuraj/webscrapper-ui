import React, { Component } from 'react'
import { Form, Card, CardContent, Container, CardHeader, Accordion, Icon, Label, TextArea } from 'semantic-ui-react'
import bgImg from './assets/img/bg.jpg'
import axios from 'axios';
import swal from 'sweetalert2';

const tagOptions = [
  { key: 'span', text: 'span', value: 'span' },
  { key: 'a', text: 'a', value: 'a' },
  { key: 'li', text: 'li', value: 'li' },
  { key: 'ul', text: 'ul', value: 'ul' },
  { key: 'header', text: 'header', value: 'header' },
  { key: 'div', text: 'div', value: 'div' },
  { key: 'p', text: 'p', value: 'p' },
  { key: 'tr', text: 'tr', value: 'tr' },
  { key: 'h1', text: 'h1', value: 'h1' },
  { key: 'h2', text: 'h2', value: 'h2' },
  { key: 'h3', text: 'h3', value: 'h3' },
  { key: 'h4', text: 'h4', value: 'h4' },
  { key: 'h5', text: 'h5', value: 'h5' },
]

const tagTypeOptions = [
  { key: 'id', text: 'id', value: 'id' },
  { key: 'class', text: 'class', value: 'class' },
]

class App extends Component {
  state = {
    activeIndex: 0,
    url: '',
    tagName: tagOptions[0].value,
    tagType: tagTypeOptions[0].value,
    tagTypeName: '',
    scrapedData: null,
    isScraped: false
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  onSubmit = async (e) => {
    e.preventDefault();
    let scrapeObj = {
      url: "https://www.scoi.com/about-us/patient-reviews?page=1",
      tagName: "span",
      tagType: "class",
      tagTypeName: "field-content"
    }
    await axios.post(`https://flask-scrapper-api.herokuapp.com/scrape`,
      scrapeObj,
      {
        "Content-Type": "application/json"
      }
    ).then(res => {
      console.log(res)
      this.setState({
        scrapedData: res.data,
        isScraped: true
      })
      swal.fire({
        title: "Success!",
        text: "Scraped successfully!!",
        type: "success"
      })
    }).catch(error => {
      swal.fire({
        title: "Error!",
        text: "Scrape error " + error.message,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
    });
  }

  handleChange = (e) => this.setState({
    [e.target.name]: e.target.value
  })

  render() {
    const { value, activeIndex } = this.state
    return (
      <div className="App" style={{
        height: "100vh",
        backgroundImage: `url(${bgImg})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      }}>

        <Card raised centered style={{ width: "50vw" }}>
          <CardHeader textAlign="center">
            <Label as='a' color='teal' tag>
              <h2>
                Web Scrapper Automation
            </h2>
            </Label>

          </CardHeader>
          <CardContent>
            <Form>
              <Form.Group widths='equal'>
                <Form.Input fluid label='URL' placeholder='Enter the URL' name="url" onChange={this.handleChange} />
              </Form.Group>
              <Form.Group widths='equal'>
                <Form.Select
                  fluid
                  onChange={(e) => {
                    this.setState({
                      tagName: e.target.textContent
                    })
                  }}
                  name="tagName"
                  label='Tag Name'
                  options={tagOptions}
                  defaultValue={tagOptions[0].value}
                  placeholder='Tag Name'
                />
                <Form.Select
                  fluid
                  name="tagType"
                  onChange={(e) => {
                    this.setState({
                      tagType: e.target.textContent
                    })
                  }}
                  label='Tag Type'
                  defaultValue={tagTypeOptions[0].value}
                  options={tagTypeOptions}
                  placeholder='Tag Type'
                />

              </Form.Group>
              <Form.Group widths='equal'>
                <Form.Input fluid label='Tag Type Name' placeholder='Tag Type Name' name="tagTypeName" onChange={this.handleChange} />
              </Form.Group>
              <Form.Button basic color='blue' fluid onClick={this.onSubmit}><strong>Scrape</strong></Form.Button>
            </Form>

            <Accordion>
              <Accordion.Title
                active={activeIndex === 0}
                index={0}
                onClick={this.handleClick}
              >
                <Icon name='dropdown' />
          What is a Tag Name?
        </Accordion.Title>
              <Accordion.Content active={activeIndex === 0}>
                <p>
                  After inspecting the code, you will find the particluar information lie in a html tag like div, span, li, etc. This is
                  called the tag name here
              </p>
              </Accordion.Content>

              <Accordion.Title
                active={activeIndex === 1}
                index={1}
                onClick={this.handleClick}
              >
                <Icon name='dropdown' />
              What is a Tag Type?
        </Accordion.Title>
              <Accordion.Content active={activeIndex === 1}>
                <p>
                  Id or the class is known as the Tag type in here to identify the particular tag name
          </p>
              </Accordion.Content>

              <Accordion.Title
                active={activeIndex === 2}
                index={2}
                onClick={this.handleClick}
              >
                <Icon name='dropdown' />
              What is a Tag Type Name?
        </Accordion.Title>
              <Accordion.Content active={activeIndex === 2}>
                <p>
                  This will include the tag which wrap up the text we want to scrape
          </p>

              </Accordion.Content>
            </Accordion>
            {
              this.state.isScraped
                ?
                <TextArea placeholder='Tell us more' value={this.state.scrapedData} style={{
                  "minHeight": "100px",
                  "minWidth": "45vw",
                }} />
                :
                null
            }

          </CardContent>

        </Card>
      </div>
    )
  }
}

export default App