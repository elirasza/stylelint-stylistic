const styled = { div: () => {} }

module.exports = styled.div`
  .example {
    opacity: 0.5;

    .example .other {
      margin: 1rem;
    }

    &:hover {
      background-color: ${({ theme }) => theme.backgroundColor};
    }
  }
`
