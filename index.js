
import React  from 'react';

import {
    View, Text, Animated,
    TouchableOpacity
} from 'react-native'

import {Component}  from 'react';

import Icon from 'react-native-vector-icons/MaterialIcons'

class TreeView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            collapsed: {}
        }
        this.setCollapsed = this.setCollapsed.bind(this)
    }

    _toggleState(type, i, node,parent) {
        const {collapsed} = this.state
        const {onItemClicked} = this.props

        collapsed[`${parent}${parent!==''?'/':''}${node.text}`] = !collapsed[`${parent}${parent!==''?'/':''}${node.text}`]
        this.setState({
            collapsed: collapsed
        })
        if (onItemClicked)
            onItemClicked(type, i, node,parent)
    }

    setCollapsed(node,parent){
      const {collapsed} = this.state

      collapsed[`${parent}${parent!==''?'/':''}${node.text}`] = !collapsed[`${parent}${parent!==''?'/':''}${node.text}`]
      this.setState({
          collapsed: collapsed
      })
    }

    _getStyle(type, tag) {
        return [styles[tag], styles[type + tag]]
    }

    _getNodeView(type, i, node,parent) {
        const {collapsed} = this.state
        const iconSize = type == 'root' ? 16 : 14
        const hasChildren = !!node.data
        const icon = node.icon ? node.icon : (collapsed[`${parent}${parent!==''?'/':''}${node.text}`] ? 'chevron-right' : 'keyboard-arrow-down')
        return (
            <View style={this._getStyle(type, 'item')}>
                {
                    !hasChildren && !node.icon  ? null : <Icon style={[this._getStyle(type, 'icon'),node.iconStyle]} size={iconSize} name={icon} />
                }
                <Text style={[this._getStyle(type, 'text'),node.textStyle]}> {node.text} </Text>
            </View>
        )
    }

    _getNode(type, i, node,parent) {
        const {collapsed} = this.state
        const {renderItem} = this.props
        const hasChildren = !!node.data
        if (collapsed[`${parent}${parent!==''?'/':''}${node.text}`] === undefined) {
          collapsed[`${parent}${parent!==''?'/':''}${node.text}`] = node.initCollapse
        }


        // background={TouchableNativeFeedback.SelectableBackground()}

        return (
            <View key={i} style={this._getStyle(type, 'node')} >
                <TouchableOpacity
                    onPress={() => this._toggleState.bind(this)(type, i, node,parent)}>
                    {renderItem ? renderItem(type, i, node) : this._getNodeView(type, i, node,parent)}
                </TouchableOpacity>
                <View style={styles.children}>
                    {
                        collapsed[`${parent}${parent!==''?'/':''}${node.text}`] ? null : this.getTree('children', node.data || [],`${parent}${parent!==''?'/':''}${node.text}`)
                    }
                </View>
            </View>
        )
    }

    getTree(type, data,parent) {
        const nodes = [];
        for (const i = 0; i < data.length; i++) {
            nodes.push(this._getNode(type, i, data[i],parent))
        }
        return nodes
    }

    render() {
        const {data} = this.props
        return (
            <View style={[styles.tree,this.props.style]}>
                {this.getTree('root', data,'')}
            </View>
        )
    }
}

const styles = {
    tree: {
        padding: 10
    },
    rootnode: {
        paddingBottom: 10,
    },
    node: {
        paddingTop: 10
    },
    item: {
        flexDirection: 'row',
    },
    children: {
        paddingLeft: 20
    },
    icon: {
        paddingRight: 10,
        color: '#333',
        alignSelf: 'center'
    },
    roottext: {
        fontSize: 18
    }
}

export default TreeView
