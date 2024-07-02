import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import JobCardItem from '../JobCardItem'

import './index.css'

const apinContants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const locationList = [
  {
    locationLabel: 'Hyderabad',
    locationId: 'hyderabadId',
  },
  {
    locationLabel: 'Bangalore',
    locationId: 'bangaloreId',
  },
  {
    locationLabel: 'Chennai',
    locationId: 'chennaiId',
  },
  {
    locationLabel: 'Delhi',
    locationId: 'delhiId',
  },
  {
    locationLabel: 'Mumbai',
    locationId: 'mumbaiId',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    employmentTypeList: [],
    salary: salaryRangesList[0].salaryRangeId,
    searchInput: '',
    jobCardDetailsList: [],
    apiStatus: apinContants.initial,
    userProfileDetails: '',
    apiProfileStatus: apinContants.initial,
    locationInputList: [],
  }

  componentDidMount() {
    this.getUserProfileDetails()
    this.getJobDetailsApi()
  }

  setSearchJobs = event => {
    this.setState({searchInput: event.target.value})
  }

  setSalaryRange = event => {
    this.setState({salary: event.target.id}, this.getJobDetailsApi)
  }

  setEmploymentType = event => {
    const {employmentTypeList} = this.state

    if (employmentTypeList.includes(event.target.value)) {
      const filteredList = employmentTypeList.filter(
        each => event.target.value !== each,
      )
      this.setState(
        {
          employmentTypeList: filteredList,
        },
        this.getJobDetailsApi,
      )
    } else {
      this.setState(
        prevState => ({
          employmentTypeList: [
            ...prevState.employmentTypeList,
            event.target.value,
          ],
        }),
        this.getJobDetailsApi,
      )
    }
  }

  setLocation = event => {
    const {locationInputList} = this.state

    if (locationInputList.includes(event.target.value)) {
      const filteredList = locationInputList.filter(
        each => event.target.value !== each,
      )
      this.setState(
        {
          locationInputList: filteredList,
        },
        this.getJobDetailsApi,
      )
    } else {
      this.setState(
        prevState => ({
          locationInputList: [
            ...prevState.locationInputList,
            event.target.value,
          ],
        }),
        this.getJobDetailsApi,
      )
    }
  }

  getUserProfileDetails = async () => {
    this.setState({apiProfileStatus: apinContants.inProgress})

    const jwtToken = Cookies.get('jwt_token')

    const profileUrl = 'https://apis.ccbp.in/profile'
    const profileOptions = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const userDetails = await fetch(profileUrl, profileOptions)
    const userDetailsData = await userDetails.json()

    if (userDetails.status === 200) {
      const formatUserDetails = {
        name: userDetailsData.profile_details.name,
        profileImageUrl: userDetailsData.profile_details.profile_image_url,
        shortBio: userDetailsData.profile_details.short_bio,
      }
      this.setState({
        userProfileDetails: formatUserDetails,
        apiProfileStatus: apinContants.success,
      })
    } else if (userDetails.status === 401) {
      this.setState({apiProfileStatus: apinContants.failure})
    } else {
      this.setState({apiProfileStatus: apinContants.failure})
    }
  }

  refreshPage = () => {
    this.getJobDetailsApi()
  }

  getJobDetailsApi = async () => {
    this.setState({apiStatus: apinContants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {searchInput, employmentTypeList, salary} = this.state

    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeList}&minimum_package=${salary}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)
    if (response.status === 200) {
      const data = await response.json()

      const formattedData = data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))

      this.setState({
        jobCardDetailsList: formattedData,
        apiStatus: apinContants.success,
      })
    } else {
      this.setState({apiStatus: apinContants.failure})
    }
  }

  onLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button
        className="failure-button"
        onClick={this.refreshPage}
        type="button"
      >
        Retry
      </button>
    </div>
  )

  searchInputResults = () => {
    this.getJobDetailsApi()
  }

  getJobsSection = () => {
    const {searchInput, jobCardDetailsList, locationInputList} = this.state

    const filterLocation = locationInputList.length
      ? jobCardDetailsList.filter(each =>
          locationInputList.includes(each.location),
        )
      : jobCardDetailsList

    return (
      <>
        <div>
          <input
            type="search"
            className="search-input"
            onChange={this.setSearchJobs}
            value={searchInput}
            id="search"
          />
          <label htmlFor="search">
            <button
              type="button"
              aria-label="search jobs"
              data-testid="searchButton"
              className="search-icon-button"
              onClick={this.searchInputResults}
            >
              <BsSearch className="search-icon" />
            </button>
          </label>
        </div>

        {filterLocation.length === 0 ? (
          <div className="no-jobs-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              alt="no jobs"
              className="no-job-image"
            />
            <h1 className="not-found-heading">No Jobs Found</h1>
            <p className="not-found-description">
              We could not find any jobs. Try other filters
            </p>
          </div>
        ) : (
          filterLocation.map(each => (
            <JobCardItem key={each.id} jobCardItem={each} />
          ))
        )}
      </>
    )
  }

  getProfile = () => {
    const {userProfileDetails} = this.state
    const {name, profileImageUrl, shortBio} = userProfileDetails
    return (
      <div className="profile-container">
        <img
          src={profileImageUrl}
          alt="profile"
          className="login-website-logo"
        />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-role">{shortBio}</p>
      </div>
    )
  }

  onProfileFailureView = () => (
    <div className="profile-failure-container">
      <button
        className="failure-button"
        onClick={this.refreshPage}
        type="button"
      >
        Retry
      </button>
    </div>
  )

  switchTodisplayPage = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apinContants.failure:
        return this.onFailureView()
      case apinContants.inProgress:
        return this.onLoadingView()
      case apinContants.success:
        return this.getJobsSection()
      default:
        return null
    }
  }

  switchUserProfile = () => {
    const {apiProfileStatus} = this.state

    switch (apiProfileStatus) {
      case apinContants.failure:
        return this.onProfileFailureView()
      case apinContants.inProgress:
        return this.onLoadingView()
      case apinContants.success:
        return this.getProfile()
      default:
        return null
    }
  }

  render() {
    const {salary, employmentType} = this.state

    return (
      <div className="jobs-page-container">
        <Header />
        <div className="jobs-container">
          <div className="profile-filter-container">
            {this.switchUserProfile()}
            <hr className="hr-line" />
            <ul className="filter-container">
              <h1 className="types-heading">Type of Employment</h1>
              {employmentTypesList.map(each => (
                <li className="checkbox-container" key={each.employmentTypeId}>
                  <input
                    type="checkbox"
                    id={each.employmentTypeId}
                    className="checkbox"
                    onChange={this.setEmploymentType}
                    value={employmentType}
                  />
                  <label
                    htmlFor={each.employmentTypeId}
                    className="check-box-label"
                  >
                    {each.label}
                  </label>
                </li>
              ))}
              <hr className="hr-line" />
              <h1 className="types-heading">Salary Range</h1>
              {salaryRangesList.map(each => (
                <li className="checkbox-container" key={each.salaryRangeId}>
                  <input
                    type="radio"
                    id={each.salaryRangeId}
                    className="checkbox"
                    onChange={this.setSalaryRange}
                    value={salary}
                    checked={each.salaryRangeId === salary}
                  />
                  <label
                    htmlFor={each.salaryRangeId}
                    className="check-box-label"
                  >
                    {each.label}
                  </label>
                </li>
              ))}
              <hr className="hr-line" />
              <h1 className="types-heading">Locations</h1>
              {locationList.map(each => (
                <li className="checkbox-container" key={each.locationId}>
                  <input
                    type="checkbox"
                    id={each.locationId}
                    className="checkbox"
                    onChange={this.setLocation}
                    value={each.locationLabel}
                  />
                  <label htmlFor={each.locationId} className="check-box-label">
                    {each.locationLabel}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="jobs-card-container">
            {this.switchTodisplayPage()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
